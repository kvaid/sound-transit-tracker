// Stops data for all Sound Transit lines
const stopsData = {
    stops: [
        // 1 Line - Northbound Platforms (N-series codes - North of Downtown Seattle)
        { id: "40_N23-T1", name: "Lynnwood City Center Station - NE bound", lat: 47.820225, lon: -122.315387 },
        { id: "40_N22-T1", name: "Mountlake Terrace Station - N bound", lat: 47.786091, lon: -122.316167 },
        { id: "40_N21-T1", name: "Shoreline North/185th Station - N bound", lat: 47.765718, lon: -122.317641 },
        { id: "40_N20-T1", name: "Shoreline South/148th Station - N bound", lat: 47.743318, lon: -122.317887 },
        { id: "40_N19-T1", name: "NE 130th Station - N bound", lat: 47.723183, lon: -122.317782 },
        { id: "40_N18-T1", name: "Northgate Station - N bound", lat: 47.703168, lon: -122.328177 },
        { id: "40_N17-T1", name: "Roosevelt Station - N bound", lat: 47.676621, lon: -122.316256 },
        { id: "40_N16-T1", name: "U District Station - N bound", lat: 47.660527, lon: -122.313621 },
        { id: "40_N15-T1", name: "University of Washington Station - N bound", lat: 47.650913, lon: -122.303599 },
        { id: "40_N14-T1", name: "Capitol Hill Station - N bound", lat: 47.623154, lon: -122.320438 },
        { id: "40_N13-T1", name: "Westlake Station - N bound", lat: 47.611832, lon: -122.337164 },
        { id: "40_N12-T1", name: "Symphony Station - N bound", lat: 47.608947, lon: -122.336981 },
        { id: "40_N11-T1", name: "University Street Station - N bound", lat: 47.607746, lon: -122.335736 },
        { id: "40_N10-T1", name: "Pioneer Square Station - N bound", lat: 47.602711, lon: -122.33087 },
        { id: "40_N09-T1", name: "International District/Chinatown Station - N bound", lat: 47.598445, lon: -122.327803 },
        
        // 1 Line - Southbound Platforms (N-series codes - North of Downtown Seattle)
        { id: "40_N23-T2", name: "Lynnwood City Center Station - SW bound", lat: 47.820225, lon: -122.315787 },
        { id: "40_N22-T2", name: "Mountlake Terrace Station - S bound", lat: 47.786091, lon: -122.316567 },
        { id: "40_N21-T2", name: "Shoreline North/185th Station - S bound", lat: 47.765718, lon: -122.318041 },
        { id: "40_N20-T2", name: "Shoreline South/148th Station - S bound", lat: 47.743318, lon: -122.318287 },
        { id: "40_N19-T2", name: "NE 130th Station - S bound", lat: 47.723183, lon: -122.318182 },
        { id: "40_N18-T2", name: "Northgate Station - S bound", lat: 47.703168, lon: -122.328577 },
        { id: "40_N17-T2", name: "Roosevelt Station - S bound", lat: 47.676621, lon: -122.316656 },
        { id: "40_N16-T2", name: "U District Station - S bound", lat: 47.660527, lon: -122.314021 },
        { id: "40_N15-T2", name: "University of Washington Station - S bound", lat: 47.650913, lon: -122.303999 },
        { id: "40_N14-T2", name: "Capitol Hill Station - S bound", lat: 47.623154, lon: -122.320838 },
        { id: "40_N13-T2", name: "Westlake Station - S bound", lat: 47.611832, lon: -122.337564 },
        { id: "40_N12-T2", name: "Symphony Station - S bound", lat: 47.608947, lon: -122.337381 },
        { id: "40_N11-T2", name: "University Street Station - S bound", lat: 47.607746, lon: -122.336136 },
        { id: "40_N10-T2", name: "Pioneer Square Station - S bound", lat: 47.602711, lon: -122.33127 },
        { id: "40_N09-T2", name: "International District/Chinatown Station - S bound", lat: 47.598445, lon: -122.328203 },
        
        // 1 Line - Northbound Platforms (S-series codes - South of Downtown Seattle)
        { id: "40_S01-T1", name: "Stadium Station - N bound", lat: 47.592047, lon: -122.327159 },
        { id: "40_S02-T1", name: "SODO Station - N bound", lat: 47.580583, lon: -122.327608 },
        { id: "40_S03-T1", name: "Beacon Hill Station - N bound", lat: 47.579245, lon: -122.311608 },
        { id: "40_S04-T1", name: "Mount Baker Station - N bound", lat: 47.576431, lon: -122.296858 },
        { id: "40_S05-T1", name: "Columbia City Station - N bound", lat: 47.560021, lon: -122.292312 },
        { id: "40_S06-T1", name: "Othello Station - N bound", lat: 47.537988, lon: -122.281351 },
        { id: "40_S07-T1", name: "Rainier Beach Station - N bound", lat: 47.522969, lon: -122.27908 },
        { id: "40_S08-T1", name: "Tukwila International Blvd Station - N bound", lat: 47.464098, lon: -122.289032 },
        { id: "40_S09-T1", name: "SeaTac/Airport Station - N bound", lat: 47.445235, lon: -122.296768 },
        { id: "40_S10-T1", name: "Angle Lake Station - N bound", lat: 47.444271, lon: -122.297797 },
        { id: "40_S11-T1", name: "Federal Way Downtown Station - N bound", lat: 47.322197, lon: -122.312126 },
        
        // 1 Line - Southbound Platforms (S-series codes - South of Downtown Seattle)
        { id: "40_S01-T2", name: "Stadium Station - S bound", lat: 47.592047, lon: -122.327559 },
        { id: "40_S02-T2", name: "SODO Station - S bound", lat: 47.580583, lon: -122.328008 },
        { id: "40_S03-T2", name: "Beacon Hill Station - S bound", lat: 47.579245, lon: -122.312008 },
        { id: "40_S04-T2", name: "Mount Baker Station - S bound", lat: 47.576431, lon: -122.297258 },
        { id: "40_S05-T2", name: "Columbia City Station - S bound", lat: 47.560021, lon: -122.292712 },
        { id: "40_S06-T2", name: "Othello Station - S bound", lat: 47.537988, lon: -122.281751 },
        { id: "40_S07-T2", name: "Rainier Beach Station - S bound", lat: 47.522969, lon: -122.27948 },
        { id: "40_S08-T2", name: "Tukwila International Blvd Station - S bound", lat: 47.464098, lon: -122.289432 },
        { id: "40_S09-T2", name: "SeaTac/Airport Station - S bound", lat: 47.445235, lon: -122.297168 },
        { id: "40_S10-T2", name: "Angle Lake Station - S bound", lat: 47.444271, lon: -122.298197 },
        { id: "40_S11-T2", name: "Federal Way Downtown Station - S bound", lat: 47.322197, lon: -122.312326 },
        
        // 2 Line - Eastbound/Northbound Platforms (South Bellevue to Downtown Redmond)
        { id: "40_E09-T1", name: "South Bellevue Station - Terminal", lat: 47.586732, lon: -122.190404 },
        { id: "40_E11-T1", name: "East Main Station - N bound", lat: 47.608403, lon: -122.191099 },
        { id: "40_E15-T1", name: "Bellevue Downtown Station - E bound", lat: 47.615183, lon: -122.191303 },
        { id: "40_E19-T1", name: "Wilburton Station - N bound", lat: 47.618229, lon: -122.183687 },
        { id: "40_E21-T1", name: "Spring District Station - E bound", lat: 47.623776, lon: -122.178239 },
        { id: "40_E23-T1", name: "BelRed Station - E bound", lat: 47.6244, lon: -122.165224 },
        { id: "40_E25-T1", name: "Overlake Village Station - NE bound", lat: 47.636622, lon: -122.138361 },
        { id: "40_E27-T1", name: "Redmond Technology Station - E bound", lat: 47.645199, lon: -122.133673 },
        { id: "40_E29-T1", name: "Marymoor Village Station - E bound", lat: 47.667381, lon: -122.109118 },
        { id: "40_E31-T1", name: "Downtown Redmond Station - Terminal", lat: 47.671467, lon: -122.117864 },
        
        // 2 Line - Westbound/Southbound Platforms (Downtown Redmond to South Bellevue)
        { id: "40_E31-T2", name: "Downtown Redmond Station - W bound", lat: 47.671788, lon: -122.118952 },
        { id: "40_E29-T2", name: "Marymoor Village Station - W bound", lat: 47.667166, lon: -122.110398 },
        { id: "40_E27-T2", name: "Redmond Technology Station - W bound", lat: 47.644424, lon: -122.133556 },
        { id: "40_E25-T2", name: "Overlake Village Station - SW bound", lat: 47.636151, lon: -122.139236 },
        { id: "40_E23-T2", name: "BelRed Station - W bound", lat: 47.624499, lon: -122.166364 },
        { id: "40_E21-T2", name: "Spring District Station - W bound", lat: 47.623772, lon: -122.178901 },
        { id: "40_E19-T2", name: "Wilburton Station - S bound", lat: 47.617909, lon: -122.183806 },
        { id: "40_E15-T2", name: "Bellevue Downtown Station - W bound", lat: 47.615285, lon: -122.192531 },
        { id: "40_E11-T2", name: "East Main Station - S bound", lat: 47.607707, lon: -122.191202 },
        { id: "40_E09-T2", name: "South Bellevue Station - W bound", lat: 47.586932, lon: -122.190604 },
        
        // T Line Stations (Tacoma Link)
        { id: "40_T01-T1", name: "Theater District/St. Joseph Station - N bound", lat: 47.256127, lon: -122.441694 },
        { id: "40_T02-T1", name: "Commerce Street Station - N bound", lat: 47.253801, lon: -122.441041 },
        { id: "40_T03-T1", name: "Convention Center/S 15th St Station - N bound", lat: 47.245006, lon: -122.438536 },
        { id: "40_T04-T1", name: "Union Station/S 19th St Station - N bound", lat: 47.245928, lon: -122.434642 },
        { id: "40_T05-T1", name: "Tacoma Dome Station - N bound", lat: 47.239848, lon: -122.428201 },
        { id: "40_T01-T2", name: "Theater District/St. Joseph Station - S bound", lat: 47.255927, lon: -122.441894 },
        { id: "40_T02-T2", name: "Commerce Street Station - S bound", lat: 47.253601, lon: -122.441241 },
        { id: "40_T03-T2", name: "Convention Center/S 15th St Station - S bound", lat: 47.244806, lon: -122.438736 },
        { id: "40_T04-T2", name: "Union Station/S 19th St Station - S bound", lat: 47.245728, lon: -122.434842 },
        { id: "40_T05-T2", name: "Tacoma Dome Station - S bound", lat: 47.239648, lon: -122.428401 },
        
        // S Line Stations (Sounder Commuter Rail) - Northbound
        { id: "40_KS01-T1", name: "King Street Station - N bound", lat: 47.598545, lon: -122.330061 },
        { id: "40_TK01-T1", name: "Tukwila Station - N bound", lat: 47.461387, lon: -122.24079 },
        { id: "40_KE01-T1", name: "Kent Station - N bound", lat: 47.384357, lon: -122.233138 },
        { id: "40_AU01-T1", name: "Auburn Station - N bound", lat: 47.306821, lon: -122.232192 },
        { id: "40_SU01-T1", name: "Sumner Station - N bound", lat: 47.201653, lon: -122.244895 },
        { id: "40_PU01-T1", name: "Puyallup Station - N bound", lat: 47.192578, lon: -122.295867 },
        { id: "40_TD01-T1", name: "Tacoma Dome Station - N bound", lat: 47.239848, lon: -122.428201 },
        { id: "40_ST01-T1", name: "South Tacoma Station - N bound", lat: 47.201215, lon: -122.483476 },
        { id: "40_LW01-T1", name: "Lakewood Station - N bound", lat: 47.15602, lon: -122.503905 },
        
        // S Line Stations (Sounder Commuter Rail) - Southbound
        { id: "40_KS01-T2", name: "King Street Station - S bound", lat: 47.598345, lon: -122.330261 },
        { id: "40_TK01-T2", name: "Tukwila Station - S bound", lat: 47.461187, lon: -122.24099 },
        { id: "40_KE01-T2", name: "Kent Station - S bound", lat: 47.384157, lon: -122.233338 },
        { id: "40_AU01-T2", name: "Auburn Station - S bound", lat: 47.306621, lon: -122.232392 },
        { id: "40_SU01-T2", name: "Sumner Station - S bound", lat: 47.201453, lon: -122.245095 },
        { id: "40_PU01-T2", name: "Puyallup Station - S bound", lat: 47.192378, lon: -122.296067 },
        { id: "40_TD01-T2", name: "Tacoma Dome Station - S bound", lat: 47.239648, lon: -122.428401 },
        { id: "40_ST01-T2", name: "South Tacoma Station - S bound", lat: 47.201015, lon: -122.483676 },
        { id: "40_LW01-T2", name: "Lakewood Station - S bound", lat: 47.15582, lon: -122.504105 },
        
        // Explicitly identified stops
        { id: "40_565", name: "Symphony Station", lat: 47.608947, lon: -122.337181 },
        { id: "40_620", name: "Bellevue Downtown Station", lat: 47.615223, lon: -122.192084 },
        { id: "40_99610", name: "Capitol Hill Station - S bound", lat: 47.623154, lon: -122.320838 },
        { id: "40_99603", name: "Capitol Hill Station - N bound", lat: 47.623154, lon: -122.320438 },
        { id: "1_99610", name: "Capitol Hill Station - S bound (KCM ID)", lat: 47.623154, lon: -122.320838 }
    ]
}; 