const getImages = (packChoice, pet, growthStage) => {
    console.log(growthStage)
    console.log(typeof(pet))
    if (packChoice == 0 && pet > 0 && growthStage == 1) {
        $('#image').attr("src", "./../../assets/images/27gotchis/0.png")
        return
    }
    if (packChoice > 0 && pet > 1 && growthStage == 1) {
        $('#image').attr("src", "./../../assets/images/27gotchis/0.png")
        return
    }
    if (packChoice == 0 && pet > 0 && growthStage == 3) {
        $('#image').attr("src", "./../../assets/images/27gotchis/1.png")
        return
    }
    if (packChoice > 0 && pet > 1 && growthStage == 3) {
        $('#image').attr("src", "./../../assets/images/27gotchis/1.png")
        return
    }

    if (packChoice > 0 && pet > 1 && growthStage == 2) {
        $('#image').attr("src", "./../../assets/images/27gotchis/" + pet + ".png")
        return
    }

    if (packChoice == 0 && pet > 0 && growthStage == 2) {
        $('#image').attr("src", "./../../assets/images/27gotchis/" + (parseInt(pet)+26) + ".png")
        return
    }
}