// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./interface.sol";
import "./SafeMath.sol";

pragma solidity ^0.8.0;

interface NftInterface {
    function alive(uint256 tokenId) external view returns (bool);
    function Unit(uint256 tokenId) external view returns (
        string memory name_, uint256 createdAt_, uint256 feedLevel_,
        uint256 generation_, uint256 generationTicker_, uint256 lastPlayTime_,
        uint256 availableFreeDays_, uint256 prestige_, uint256 rewards_,
        uint256 tokensToRevive_, uint256 packChoice
    );
}

contract TimeData {
    using SafeMath for uint256;

    uint256 internal ONE_DAY = 86400;
    uint256 internal ONE_HOUR = 3600; 
    uint256 internal MAX_TIME = 2**256 - 1;
    
    address internal NftAddress = 0x5e3397b6030Ef7c4f36bdcC26AFCEdDcB902D221; // change to mainnet gotchi contract
    
function getTimeData(uint256 tokenId) public view returns (
    bool isItPlayTime_, uint256 secondsUntilNextPlay_, uint256 timeBetweenPlays_, uint256 playsPerGeneration_,
    bool isInFeedWindow_, uint256 secondsUntilNextFeed_, uint256 secondsLeftInFeedWindow_ ) {( 
        ,uint256 createdAt_, uint256 feedLevel_, uint256 generation_,,
        uint256 lastPlayTime_,, uint256 prestige_,,,
    ) = NftInterface(NftAddress).Unit(tokenId);
        
    uint256 elapsed;
    
    if (createdAt_ != MAX_TIME && NftInterface(NftAddress).alive(tokenId)) {
        
        if (block.timestamp.sub(lastPlayTime_) > ONE_HOUR.add(prestige_.mul(ONE_HOUR))) { // in play
            elapsed = block.timestamp.sub(lastPlayTime_);
            if (feedLevel_ > uint256(block.timestamp.sub(createdAt_)).div(ONE_DAY)) { // not in a feed
                return (
                    true, 0, ONE_HOUR.add(prestige_.mul(ONE_HOUR)), generation_,  
                    false, feedLevel_.mul(ONE_DAY).sub(block.timestamp.sub(createdAt_)), ONE_HOUR.mul(generation_) 
                );
            }
            if (feedLevel_ == uint256(block.timestamp.sub(createdAt_)).div(ONE_DAY) && block.timestamp.sub(createdAt_).mod(ONE_DAY) < ONE_HOUR.mul(generation_)) { // in feeding window
                return (
                    true, 0, ONE_HOUR.add(prestige_.mul(ONE_HOUR)), generation_, 
                    true, 0,  ONE_HOUR.mul(generation_).sub(block.timestamp.sub(createdAt_).mod(ONE_DAY))
                );
            }
        } else { // not in play
            elapsed = block.timestamp.sub(lastPlayTime_);
            if (feedLevel_ > uint256(block.timestamp.sub(createdAt_)).div(ONE_DAY)) {  // not in a feed
                return (
                    false, ONE_HOUR.add(prestige_.mul(ONE_HOUR)).sub(elapsed), ONE_HOUR.add(prestige_.mul(ONE_HOUR)), generation_, 
                    false, feedLevel_.mul(ONE_DAY).sub(block.timestamp.sub(createdAt_)), ONE_HOUR.mul(generation_)
                );
            }
            if (feedLevel_ == uint256(block.timestamp.sub(createdAt_)).div(ONE_DAY) && block.timestamp.sub(createdAt_).mod(ONE_DAY) < ONE_HOUR.mul(generation_)) { // in feeding window
                return (
                    false, ONE_HOUR.add(prestige_.mul(ONE_HOUR)).sub(elapsed), ONE_HOUR.add(prestige_.mul(ONE_HOUR)), generation_, 
                    true, 0, ONE_HOUR.mul(generation_).sub(block.timestamp.sub(createdAt_).mod(ONE_DAY))
                );
            }
        }
    }
    return (false, 0, 0, 0, false, 0, 0);
    }
}