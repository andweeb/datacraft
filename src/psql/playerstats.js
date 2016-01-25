for(var i = 1; i <= 14; i++) {
    process.stdout.write(`select distinct(player_a) into distinct_players${i} from server${i}; `);
}

