package com.bebetab.data

data class AnimalLiveCam(
    val id: String,
    val nameFr: String,
    val nameEn: String,
    val animalFr: String,
    val animalEn: String,
    val location: String,
    val emoji: String,
    val youtubeUrl: String?,
    val officialUrl: String,
    val factFr: String,
    val factEn: String
)

object AnimalLiveData {
    val cams = listOf(
        AnimalLiveCam("safari_kenya","Safari africain","African Safari","Lions, éléphants, girafes, hippopotames","Lions, elephants, giraffes, hippos","Mpala, Kenya","🦁","https://www.youtube.com/watch?v=QkWGGhtTA4k","https://explore.org/livecams/african-wildlife/african-safari-camera","Au point d’eau de Mpala, on peut observer de nombreux animaux africains, surtout à l’aube et au crépuscule.","At Mpala's watering hole, many African animals can appear, especially around dawn and dusk.",listOf("animals","nature")),
        AnimalLiveCam("sea_otter","Loutres de mer","Sea Otters","Loutres de mer","Sea otters","Monterey Bay Aquarium, USA","🦦","https://www.youtube.com/watch?v=WrKZzs-CB_8","https://www.montereybayaquarium.org/cams-videos/live-cams/sea-otter-cam","Les loutres jouent, nagent et utilisent des objets pour enrichir leur quotidien.","Sea otters swim, play and use enrichment objects.",listOf("animals","nature")),
        AnimalLiveCam("shark","Requins et raies","Sharks & Rays","Requins, raies, poissons","Sharks, rays and fish","Monterey Bay Aquarium, USA","🦈","https://www.youtube.com/watch?v=wNcwiMcbiWg","https://www.montereybayaquarium.org/cams-videos/live-cams/shark-cam","La caméra montre notamment des requins-léopards, des requins à sept branchies et des raies.","The cam can show leopard sharks, sevengill sharks and rays.",listOf("animals","nature")),
        AnimalLiveCam("open_sea","Océan ouvert","Open Sea","Thons, sardines, tortues, requins","Tuna, sardines, turtles, sharks","Monterey Bay Aquarium, USA","🌊","https://www.youtube.com/watch?v=nNTVZKz219U","https://www.montereybayaquarium.org/cams-videos/live-cams/open-sea-cam","Le bassin abrite des sardines, thons, requins-marteaux, raies et tortues marines.","The exhibit is home to sardines, tuna, hammerhead sharks, rays and sea turtles.",listOf("animals","nature")),
        AnimalLiveCam("jelly","Méduses","Jelly Cam","Méduses","Jellies","Monterey Bay Aquarium, USA","🪼","https://www.youtube.com/watch?v=m1XcdxjVGos","https://www.montereybayaquarium.org/cams-videos/live-cams/jelly-cam","Les méduses dérivent avec leurs tentacules et utilisent des cellules urticantes pour capturer leurs proies.","Jellies drift with their tentacles and use stinging cells to capture prey.",listOf("animals","nature")),
        AnimalLiveCam("kelp","Forêt de kelp","Kelp Forest","Poissons, requins et vie marine","Fish, sharks and marine life","Monterey Bay Aquarium, USA","🌿",null,"https://www.montereybayaquarium.org/cams-videos/live-cams/kelp-forest-cam","La forêt de kelp fournit nourriture et abri à une grande diversité d'animaux et de plantes marines.","Kelp forests provide food and shelter for diverse marine life.",listOf("nature","beaches")),
        AnimalLiveCam("aviary","Volière","Aviary","Oiseaux","Birds","Monterey Bay Aquarium, USA","🦜",null,"https://www.montereybayaquarium.org/cams-videos/live-cams/aviary-cam","La volière permet d’observer des oiseaux et leurs comportements.","The aviary lets children observe birds and their behavior.",listOf("animals","nature")),
        AnimalLiveCam("african_river","Rivière africaine","African River Wildlife","Éléphants, girafes, koudous","Elephants, giraffes, kudus","Laikipia, Kenya","🐘",null,"https://explore.org/livecams/explore-all-cams/african-river-wildlife-camera","Cette caméra montre les couloirs de déplacement de la faune autour d'une rivière au Kenya.","This camera shows wildlife corridors around a river in Kenya.",listOf("animals","nature"))
    )
}
