// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./Ownable.sol";
import "./TokenInterface.sol";
import "./VRFConsumerBase.sol";
import "./ERC721Enumerable.sol";
import "./SafeMath.sol";
import "./Counters.sol";
import "./Base64Utils.sol";
import "./DateTime.sol";

contract Cryptogotchi is ERC721Enumerable, VRFConsumerBase, Ownable {
    using SafeMath for uint256;
    using Strings for string;
    using Counters for Counters.Counter;

    struct Device {
        string name;
        uint256 createdAt;
        uint256 feedLevel;
        uint256 generation;
        uint256 generationTicker;
        uint256 lastPlayTime;
        uint256 dayPasses;
        uint256 prestige;
        uint256 rewards;
        uint256 tokensToRevive;
        uint256 packChoice;
        uint256 pet;
    }
    
    struct Pack {
        string[3] promo_metadata;
        string[27] batch_metadata;
        bool promoLive;
        bool batchLive;
    }
    
    mapping(uint256 => Device) internal unit;
    mapping(address=>bool) internal minters;
    mapping(uint256 => Pack) internal packs;
    
    enum DeviceState { Unsold, Egg, Alive, Dead }
    
    address internal tokenAddress = 0xA8E9bcC828FADe96d757c8323846DAb9F8D987c8;
    uint256 internal reward = 1 * 10**18;
    
    uint256[5] internal typeRarity = [40, 70, 85, 95, 100]; // [5thRarest, 4thRarest, 3rdRarest, 2ndRarest 1stRarest]
    uint256[5] internal petRarity = [5, 15, 30, 60, 100]; // [1stRarest, 2ndRarest, 3rdRarest, 4thRarest, 5thRarest]
    string[6] internal svgData;
    
    bool public mintEnabled;
    bool public hatchingEnabled;
    
    uint256 internal nftPrice = 3630 * 10**18;
    uint256 internal passPrice = 50 * 10**18;

    uint256 internal ONE_DAY = 86400;
    uint256 internal ONE_HOUR = 3600;
    uint256 internal MAX_TIME = 2**256 - 1;
    
    Counters.Counter private _tokenIds;
    
    event Minted(uint256 newTokenId, address owner, uint256 mintType);
    event Claim(address owner, uint256 tokenId, uint256 dayPasses, uint256 packChoice, uint256 petChoice);
    event InitialHatch(uint256 tokenId, uint256 createdAt, address tokenOwner, uint256 packChoice, uint256 pet, uint256 petType, uint256 petColor);
    event Hatched(uint256 tokenId, uint256 createdAt, address tokenOwner, uint256 packChoice, uint256 pet);
    event Feed(uint256 tokenId, uint256 feedLevel);
    event Play(uint256 tokenId, uint256 newGenerationTick, uint256 rewardAmount);
    event Prestige(uint256 newPrestige, uint256 tokenId);
    event PassPurchased(uint256 tokenId, uint256 passLength);
    event PassRedeemed(uint256 tokenId, uint256 redeemLength);
    event RewardDistributed(address owner, uint256 amount);
    event Revive(uint256 tokenId);
    
    // chainlink
    address public VRFCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
    address public LinkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    bytes32 internal keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    uint256 internal vrfFee = 100000000000000000; // .01
    event RandomNumberRequest(bytes32 requestId, uint256 tokenId);
    mapping(bytes32 => uint256) internal requestToToken; // this was set to public

    constructor(
        // address _VRFCoordinator,
        // address _LinkToken,
        // bytes32 _keyhash
        // address _tokenAddress
        )
        // VRFConsumerBase(_VRFCoordinator,_LinkToken)
        VRFConsumerBase(VRFCoordinator,LinkToken)
        ERC721("Cryptogotchi Testnet", "PETv3") 
    {
        
        // VRFCoordinator = _VRFCoordinator;
        // LinkToken = _LinkToken;
        // keyHash = _keyhash;
        // vrfFee = 100000000000000000; 
        // tokenAddress = _tokenAddress;
    }
    
    modifier onlyMinter() {
        require(minters[msg.sender]);
        _;
    }
    
    function totalSupply() public view virtual override returns (uint256) {
        return _tokenIds.current().add(1050);
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        Device memory device = unit[tokenId];
        Pack memory promo_pack = packs[device.pet];
        Pack memory group_pack = packs[device.packChoice];
        
        // uint256 fullCycles = uint256(block.timestamp.sub(device.createdAt)).div(ONE_DAY);
        // uint256 reward_ = ((device.generation.sub(1)).mul(reward)).mul(device.prestige.add(1)).add(reward);
        
        string memory output = string(abi.encodePacked(
            svgData[0], // id
            Utils.toString(tokenId), 
            svgData[1], //name
            device.name,
            svgData[2], // generation
            Utils.toString(device.generation),
            svgData[3], // prestige
            Utils.toString(device.prestige)
        ));
        
        output = string(abi.encodePacked(
            output,
            svgData[4], // day passes
            Utils.toString(device.dayPasses),
            svgData[5], // owner
            Utils.toAsciiString(ownerOf(tokenId))
        ));
        
        if (device.packChoice == 0 && device.pet > 0) {
            if (growthStage(tokenId) == DeviceState.Egg) {
                output = string(abi.encodePacked(output, promo_pack.promo_metadata[0]));
            } else if (growthStage(tokenId) == DeviceState.Alive) {
                output = string(abi.encodePacked(output, promo_pack.promo_metadata[2]));
            } else {
                output = string(abi.encodePacked(output, promo_pack.promo_metadata[1]));
            }
        } else {
            if (growthStage(tokenId) == DeviceState.Egg) {
                output = string(abi.encodePacked(output, group_pack.batch_metadata[0]));
            } else if (growthStage(tokenId) == DeviceState.Alive) {
                output = string(abi.encodePacked(output, group_pack.batch_metadata[device.pet]));
            } else {
                output = string(abi.encodePacked(output, group_pack.batch_metadata[1]));
            }
        }
        
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Crypogotchi #', Utils.toString(tokenId), '", "description": "A Cryptogotchi is a living interactive NFT that yeilds Quantifiable Spacetime Meed (QSM) tokens as a reward when properly taken care of.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }
    
       // find growth stage for feeding, dead or alive
    function growthStage(uint256 tokenId) public view returns (DeviceState) {
        Device memory device = unit[tokenId];
        
        if (device.createdAt == 0) return DeviceState.Unsold;
        if (device.createdAt == MAX_TIME) return DeviceState.Egg;
        
        uint256 elapsed = block.timestamp.sub(device.createdAt);
        uint256 fullCycles = uint256(elapsed).div(ONE_DAY);
        uint256 modulo = elapsed.mod(ONE_DAY);

        if (device.feedLevel > fullCycles) return DeviceState.Alive;

        if (device.feedLevel == fullCycles && modulo < ONE_HOUR.mul(device.generation))  {
            return DeviceState.Alive;
        }

        return DeviceState.Dead;
    }
    
    // @dev This sets SVG for either a single promo pet or a new pack batch of 25
    // both must include 1 egg SVG at 0 and 1 dead SVG at 1 for pack or promo
    // @param group Next pack, skip 0
    // @param item Spot in the pack (promo length = 3, batch length = 27 (0 = egg, 1 = dead, 3 = pet(s))
    /* @notice When setting a random pet, there are 2 rarity levels. First levels rarest is in position 5 
        and second levels rarest starts at 1. So, example: (level1 = less rare, rarest1 = more rare) 
          petRarity = [1stRarest, 2ndRarest, 3rdRarest, 4thRarest, 5thRarest]    
          typeRarity = [5thRarest, 4thRarest, 3rdRarest, 2ndRarest 1stRarest]   */
    // @param isBatch Either true for batch or false for promo
    function setPackItem(string memory SVG, uint256 group, uint256 item, bool isBatch) public onlyOwner {
        Pack storage pack = packs[group];
        isBatch ? pack.batch_metadata[item] = SVG : pack.promo_metadata[item] = SVG;
    }
    
    function setSvgData(string memory _data, uint256 position) public onlyOwner {
        svgData[position] = _data;
    }
    
    function setLiveState(bool isPromo, bool position, uint256 _pack) public onlyOwner {
        Pack storage pack = packs[_pack];
        isPromo ? pack.promoLive = position : pack.batchLive = position;
    }
    
     // true=mint false=hatch
    function enable(bool choice) public onlyOwner {
        choice ? mintEnabled = true : hatchingEnabled = true;
    }
    
    // change pass price
    // function setPassPrice(uint256 price) public onlyOwner {
    //     passPrice = price;
    // }
    
    // withdraw any matic
    function withdraw() public onlyOwner {
        // uint256 amount = TokenInterface(_tokenAddress).balanceOf(address(this));
        payable(msg.sender).transfer(address(this).balance);
        // TokenInterface(_tokenAddress).transferFrom(address(this), payable(msg.sender), amount);
    }
    
    // minter can batch mint, claim and add passes
    function changeMinter(address account, bool position) public onlyOwner {
        position ? minters[account] = true : minters[account] = false;
    }
    
     // add day passess to a device
    function addPasses(uint256 tokenId, uint256 amount) public onlyMinter {
        Device storage device = unit[tokenId];
        device.dayPasses = device.dayPasses.add(amount); 
    }
    
    /*
    mint/claim types:
    1,0 group loaded
    0,1 promo loaded
    */
     // batch minter with custom pass amount, pack and pet and day passes
    function batchMint(address[] memory recipients, uint256 _dayPasses, uint256 _packChoice, uint256 _petChoice) public onlyMinter {
        if (_packChoice == 0) require(_petChoice > 0);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _tokenIds.increment();
            uint256 id = _tokenIds.current().add(1050);
        
            
            unit[id] = Device({
                name: "",
                createdAt: MAX_TIME, 
                feedLevel: 0, 
                lastPlayTime: MAX_TIME,
                generation: 0,
                generationTicker: 0,
                dayPasses: _dayPasses,
                prestige: 0,
                rewards: 0,
                tokensToRevive: 0,
                packChoice: _packChoice,
                pet: _petChoice
            });
        
            _safeMint(recipients[i], id);
            
            emit Minted(id, msg.sender, 0);
        }
    }
    
    function claim(address recipient, uint256 tokenId, uint256 _dayPasses, uint256 _packChoice, uint256 _petChoice) public onlyMinter {
        require(hatchingEnabled, "!h");
        require(mintEnabled, "!m");
        uint256 id;
        if (_packChoice == 0 && _petChoice == 1 || _petChoice == 2 || _petChoice == 3) {
            id = tokenId;
        } else {
            _tokenIds.increment();
            id = _tokenIds.current().add(1050);
        }
        unit[id] = Device({
            name: "",
            createdAt: MAX_TIME, 
            feedLevel: 0, 
            lastPlayTime: MAX_TIME,
            generation: 0,
            generationTicker: 0,
            dayPasses: _dayPasses,
            prestige: 0,
            rewards: 0,
            tokensToRevive: 0,
            packChoice: _packChoice,
            pet: _petChoice
        });
    
        _safeMint(recipient, id);
        
        emit Claim(recipient, id, _dayPasses, _packChoice, _petChoice);
    }
    
    // function migrate() public {
        
    // }
    
    // mint nft with tokens
    function purchaseNFT(uint256 packNumber) public {
        Pack memory pack = packs[packNumber];
        require(mintEnabled, "!m");
        require(pack.batchLive, "!p");
        require(TokenInterface(tokenAddress).allowance(msg.sender, address(this)) >= nftPrice, "!a");
        require(TokenInterface(tokenAddress).balanceOf(msg.sender) >= nftPrice, "!b");
        
        TokenInterface(tokenAddress).burn(msg.sender, nftPrice);
        
        _tokenIds.increment();
        uint256 id = _tokenIds.current().add(1050); // 1000 eggs, 50 premints
        
        unit[id] = Device({
            name: "",
            createdAt: MAX_TIME, 
            feedLevel: 0, 
            lastPlayTime: MAX_TIME,
            generation: 0,
            generationTicker: 0,
            dayPasses: 0,
            prestige: 0,
            rewards: 0,
            tokensToRevive: 0,
            packChoice: packNumber,
            pet: 0
        });
        
        _safeMint(msg.sender, id);
        
        emit Minted(id, msg.sender, 2);
    }
    
    function setName(uint256 tokenId, string memory newName) public {
        bytes memory b = bytes(newName);
        require(b.length < 17, "!n");
        require(hatchingEnabled, "!h");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        
        Device storage device = unit[tokenId];
        
        device.name = newName;
    }
    
    // hatch device from egg
    function hatch(uint256 tokenId) public {
        require(hatchingEnabled, "!h");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        
        Device storage device = unit[tokenId];
        
        require(device.createdAt == MAX_TIME, "!e");

        if (device.pet > 0) {
            
            // stops reentrancy
            device.createdAt = block.timestamp;
            device.lastPlayTime = block.timestamp;
            device.generation = 1;
            
            emit Hatched(tokenId, block.timestamp, ownerOf(tokenId), device.packChoice, device.pet);
            return;
        }
        
         // stops reentrancy
        device.createdAt = block.timestamp;
        device.lastPlayTime = block.timestamp;
        
        getRandomColor(tokenId);
    }
    
    function getRandomColor(uint256 tokenId) internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= vrfFee, "!L");
        
        requestId = requestRandomness(keyHash, vrfFee);
        // set uint256 tokenId in bytes32 mapping
        requestToToken[requestId] = tokenId;
        
        emit RandomNumberRequest(requestId, tokenId);
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        // get uint256 tokenId from bytes32 mapping
        uint256 tokenId = requestToToken[requestId];
        
        Device storage device = unit[tokenId];
        uint256 petType = selectPet(randomness.mod(100).add(1), typeRarity); // 1-100
        uint256 randomness2 = uint256(keccak256(abi.encodePacked(randomness, ownerOf(tokenId))));  //2nd random number
        uint256 petColor = selectPet(randomness2.mod(100).add(1), petRarity); // 1-100
         
        device.pet = (petType.add(1)).mul(5) .sub(petColor).add(1);
        device.generation = 1;
      
        emit InitialHatch(tokenId, device.createdAt, ownerOf(tokenId), device.packChoice, device.pet, petType, petColor);
    }

     function selectPet(uint256 randomNumber, uint256[5] memory _data) internal pure returns (uint256 position) {
        for (uint256 i = 0; i < 5; i++) {
            if (randomNumber <= _data[i]) {
                return i;
            }
        }
    }
    
    // check if alive
    function alive(uint256 tokenId) public view returns (bool) {
        return growthStage(tokenId) != DeviceState.Dead;
    }

        // get all token id's by address
    function getOwnersTokenIds(address account) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(account);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(account, i);
        }
        return tokenIds;
    }
    uint256 public counts;
    // feed 1, play 2, prestige 3, rewards 4
    function getTokensReadyToBatch(uint256 batchType, address account) internal view returns (uint256[] memory, bool) {
        (uint256[] memory ownersTokens) = getOwnersTokenIds(account);
        uint256[] memory batchArray = new uint256[](ownersTokens.length);
        uint256 count;
                
        for (uint256 i = 0; i < ownersTokens.length; i++) {
            Device memory device = unit[ownersTokens[i]];
            
            if (batchType == 1) { // feed
                if (device.createdAt != MAX_TIME) {
                    if (uint256(block.timestamp.sub(device.createdAt)).div(ONE_DAY) == device.feedLevel && 
                        alive(ownersTokens[i])) {
                        
                        batchArray[i] = ownersTokens[i];
                        count++;
                    }
                } else {
                    batchArray[i] = 0;
                }
            }
        
            if (batchType == 2) { // play
                if (device.createdAt != MAX_TIME) {
                    if (device.feedLevel != uint256(block.timestamp.sub(device.createdAt)).div(ONE_DAY) &&
                        device.generation <= 10 && device.generation > 0 && alive(ownersTokens[i]) &&
                        block.timestamp.sub(device.lastPlayTime) > ONE_HOUR.add(device.prestige.mul(ONE_HOUR))) {
                            
                        batchArray[i] = ownersTokens[i];
                        count++;
                    }
                } else {
                    batchArray[i] = 0;
                }
            }
            if (batchType == 3) { // prestige
                if (device.createdAt != MAX_TIME) {
                    if (device.rewards == 0 && device.generation == 11 && alive(ownersTokens[i]) &&
                        device.feedLevel > uint256(block.timestamp.sub(device.createdAt)).div(ONE_DAY)) {
                            
                        batchArray[i] = ownersTokens[i];
                        count++;
                    }
                } else {
                    batchArray[i] = 0;
                }
            }
            if (batchType == 4) { // rewards
                if (device.rewards > 0) {
                    batchArray[i] = ownersTokens[i];
                    count++;
                } else {
                    batchArray[i] = 0;
                }
            }
        }
        if (count != 0) {
            return (batchArray, true);
        }
        return (batchArray, false);
    }
    
    function returnReadyTokens(uint256 batchType, address account) public view returns(uint256[] memory batchArray, bool hasBatch) {
        (uint256[] memory _batchArray, bool _hasBatch) = getTokensReadyToBatch(batchType,account);
        return (_batchArray,_hasBatch);
    }
    
    // feed to keep alive
    function feed(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        require(alive(tokenId), "!x");
        
        Device storage device = unit[tokenId];
        
        uint256 elapsed = block.timestamp.sub(device.createdAt);
        uint256 fullCycles = uint256(elapsed).div(ONE_DAY);
        
        require(device.feedLevel == fullCycles, "!f");
        
        device.feedLevel = device.feedLevel.add(1);
        
        emit Feed(tokenId, device.feedLevel);
    }
    
    function batchFeed() public {
        (uint256[] memory batchArray, bool hasBatch) = returnReadyTokens(1, msg.sender);
        require(hasBatch, "nb");
        // uint256[] memory ownersTokens = returnReadyTokens(1);
        for (uint i = 0; i < batchArray.length; i++) {
            if (batchArray[i] != 0) {
              feed(batchArray[i]);
            }
        }
        return;
    }

    // play to earn tokens, increase generation
    function play(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        require(alive(tokenId), "!x");
        
        Device storage device = unit[tokenId];
        
        uint256 timeBetweenPlays = ONE_HOUR.add(device.prestige.mul(ONE_HOUR));
        uint256 elapsed = block.timestamp.sub(device.lastPlayTime);
        uint256 fullCycles = uint256(block.timestamp.sub(device.createdAt)).div(ONE_DAY);
        
        require(device.feedLevel != fullCycles, "!f");
        require(device.generation <= 10 && device.generation > 0, "!g");
        require(elapsed > timeBetweenPlays, "!t");
        
        //changing this first stops reentrancy
        device.lastPlayTime = block.timestamp;
        device.generationTicker = device.generationTicker.add(1);
        generationUp(tokenId);
    }

    function batchPlay() public {
        (uint256[] memory batchArray, bool hasBatch) = returnReadyTokens(2, msg.sender);
        require(hasBatch, "nb");
        for (uint i = 0; i < batchArray.length; i++) {
            if (batchArray[i] != 0) {
                play(batchArray[i]);
            }
        }
    }
    
    // increase generation to prestige
    function generationUp(uint256 tokenId) internal {
        Device storage device = unit[tokenId];
        
        uint256 amount = ((device.generation.sub(1)).mul(reward)).mul(device.prestige.add(1)).add(reward);
        
        // must have met required play amount
        if (device.generationTicker == device.generation) {
        // if (device.generationTicker == device.generation) {
            if (device.generation == 10) {
                //changing this first stops reentrancy
                device.generation = device.generation.add(1);
                device.tokensToRevive = device.tokensToRevive.add(amount);
                device.rewards = device.rewards.add(amount);
                // pendingRewards = pendingRewards.add(amount);
                
                emit Play(tokenId, device.generation, amount);
                return;
            } 
            if (device.generation < 10) {
                for (uint i = 0; i < 10; i++) {
                    if (device.generation.sub(1) == i) {
                        //changing this first stops reentrancy
                        device.generationTicker = 0;
                        device.tokensToRevive = device.tokensToRevive.add(amount);
                        device.rewards = device.rewards.add(amount);
                        // pendingRewards = pendingRewards.add(amount);
                        device.generation = device.generation.add(1);
                        
                        emit Play(tokenId, device.generation, amount);
                        return;
                    }
                }
            }
        }
        
        emit Play(tokenId, device.generation, 0);
    }
    
    // prestige to restart generation
    function prestige(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        require(alive(tokenId), "!a");
        
        Device storage device = unit[tokenId];
        
        uint256 elapsed = block.timestamp.sub(device.createdAt);
        uint256 fullCycles = uint256(elapsed).div(ONE_DAY);
        
        require(device.rewards == 0, "r0");
        require(device.generation == 11, "!11");
        require(device.feedLevel > fullCycles, "!f");
   
        // does this stop reentrancy?
        device.generation = 1;
        device.generationTicker = 0;
        device.lastPlayTime = block.timestamp;
        device.tokensToRevive = 0;
        device.dayPasses = device.dayPasses.add(device.prestige);
        device.prestige = device.prestige.add(1);
        
        emit Prestige(device.prestige, tokenId);
    }
    
    function batchPrestige() public {
        (uint256[] memory batchArray, bool hasBatch) = returnReadyTokens(3, msg.sender);
        require(hasBatch, "nb");
        for (uint i = 0; i < batchArray.length; i++) {
            if (batchArray[i] != 0) {
                prestige(batchArray[i]);
            }
        }
    }
    
    // withdraw pending rewards
    function getReward(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        
        Device storage device = unit[tokenId];
        
        require(device.rewards > 0, "!r");
     
        uint256 tempAmount;
        uint256 amount;
        //  ** MAYBE PROBLEM WITH RE-ENTRENY HERE***
        tempAmount = device.rewards;
        device.rewards = 0;
        amount = tempAmount;
        
        TokenInterface(tokenAddress).mint(msg.sender, amount);
        
        emit RewardDistributed(msg.sender, amount);
    }
    
    function batchGetReward() public {
        (uint256[] memory batchArray, bool hasBatch) = returnReadyTokens(4, msg.sender);
        require(hasBatch, "nb");
        for (uint i = 0; i < batchArray.length; i++) {
            if (batchArray[i] != 0) {
                getReward(batchArray[i]);
            }
        }
    }
    
    // purchase day pass
    function purchasePass(uint256 tokenId, uint256 amount) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        require(TokenInterface(tokenAddress).allowance(msg.sender, address(this)) >= amount.mul(passPrice), "!a");
        require(TokenInterface(tokenAddress).balanceOf(msg.sender) >= amount.mul(passPrice), "!b");
        require(amount > 0,"a0");
        
        uint256 calculatedPrice = passPrice.mul(amount);
        
        TokenInterface(tokenAddress).burn(msg.sender, calculatedPrice);
        
        Device storage device = unit[tokenId];
        
        device.dayPasses = device.dayPasses.add(amount);
        
        emit PassPurchased(tokenId, amount);
    }
    
    // redeem day pass
    function redeemPass(uint256 tokenId, uint256 amount) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        require(alive(tokenId), "!a");
        
        Device storage device = unit[tokenId];
        
        require(device.createdAt != MAX_TIME, "ie");
        require(amount <= device.dayPasses, "!d");
        require(amount > 0, "az");
        require(device.pet > 1, '!c');
        
        device.dayPasses = device.dayPasses.sub(amount);
        device.feedLevel = device.feedLevel.add(amount);
        
        emit PassRedeemed(tokenId, amount);
    }
    
    // revive device excluding prestige and color
    function revival(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "!o");
        require(!alive(tokenId), "x!");
        
        Device storage device = unit[tokenId];
        
        require(TokenInterface(tokenAddress).allowance(msg.sender, address(this)) >= device.tokensToRevive, "!a");
        require(TokenInterface(tokenAddress).balanceOf(msg.sender) >= device.tokensToRevive, "!b");
        require(device.pet > 0, '!c'); // dead ipfs is now metatada[1] or 1
        // require devicestate = dead
        require(device.createdAt != MAX_TIME, "ie");
        require(device.rewards == 0, "r0");
        
        if (device.tokensToRevive != 0) TokenInterface(tokenAddress).burn(msg.sender, device.tokensToRevive);

        device.createdAt = MAX_TIME;
        device.lastPlayTime = MAX_TIME;
        device.feedLevel = 0;
        device.generation = 0;
        device.generationTicker = 0;
        device.tokensToRevive = 0;

        emit Revive(tokenId);
    }
    
    function Unit(uint256 tokenId) public view returns (
        string memory name_, uint256 createdAt_, uint256 feedLevel_, uint256 generation_,
        uint256 generationTicker_, uint256 lastPlayTime_, uint256 dayPasses_, uint256 prestige_,
        uint256 rewards_, uint256 tokensToRevive_, uint256 packChoice_, uint256 pet_) {
            
        Device memory device = unit[tokenId];
        
        return (
            device.name, device.createdAt, device.feedLevel, device.generation,
            device.generationTicker, device.lastPlayTime, device.dayPasses, device.prestige,
            device.rewards, device.tokensToRevive, device.packChoice, device.pet
        );
    }
}