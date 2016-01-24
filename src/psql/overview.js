// Construct query to insert server overview values into the overview table for all servers
process.stdout.write('create table overview(server_num INT PRIMARY KEY NOT NULL, chat_interactions INT, chatters INT, peaceful_players INT, players_killed INT, killers INT, silent_killers INT, player_population INT);');
for(var i = 1; i <= 14; i++) {
    process.stdout.write(`insert into overview(server_num, chat_interactions, chatters, peaceful_players, players_killed, killers, silent_killers, player_population) select * from (select (${i}) as server_num) t1 cross join (select count(*) as chat_interactions from server${i} where key='Chat') t2 cross join (select count(distinct players) as chatters from (select player_a from server${i} where key='Chat') as players) t3 cross join (select count(*) from (select distinct peaceful_players from (select player_a from server${i}) as peaceful_players) poop where peaceful_players not in (select distinct killers from (select player_b from server${i} where key='KilledBy') as killers)) t4 cross join (select count(*) as players_killed from server${i} where key='KilledBy') t5 cross join (select count(distinct players) as killers from (select player_b from server${i} where key='KilledBy') as players) t6 cross join (select count(*) from (select distinct silent_killers from (select player_b from server${i} where key='KilledBy') as silent_killers) poop${i} where silent_killers not in (select distinct chatters from (select player_a from server${i} where key='Chat') as chatters)) t7 cross join (select count(distinct player_a) as player_population from server${i}) t8;`);
}

// Query to create table:
// create table overview(server_num INT PRIMARY KEY NOT NULL, chat_interactions INT, chatters INT, peaceful_players INT, players_killed INT, killers INT, silent_killers INT, player_population INT);
//

// // Query to insert server overview values into the overview table for the i-th server
// insert into overview(server_num, chat_interactions, chatters, peaceful_players, players_killed, killers, silent_killers, player_population)
//         select * from 
//             (select (${i}) as server_num) t1
//             cross join 
//             (select count(*) as chat_interactions from server${i} where key='Chat') t2
//             cross join 
//             (select count(distinct players) as chatters from (select player_a from server${i} where key='Chat') as players) t3
//             cross join
//             (select count(*) from (select distinct peaceful_players from (select player_a from server${i}) as peaceful_players) poop where peaceful_players not in (select distinct killers from (select player_b from server${i} where key='KilledBy') as killers)) t4
//             cross join 
//             (select count(*) as players_killed from server${i} where key='KilledBy') t5
//             cross join  
//             (select count(distinct players) as killers from (select player_b from server${i} where key='KilledBy') as players) t6
//             cross join
//             (select count(*) from (select distinct silent_killers from (select player_b from server${i} where key='KilledBy') as silent_killers) poop${i} where silent_killers not in (select distinct chatters from (select player_a from server${i} where key='Chat') as chatters)) t7
//             cross join 
//             (select count(distinct player_a) as player_population from server${i}) t8;

// Peaceful players
// select count(*) from 
//     (select distinct peaceful_players from 
//         (select player_a from server2) as peaceful_players) poop
//     where peaceful_players not in 
//         (select distinct killers from (select player_b from server2 where key='KilledBy') as killers)

// Silent killers
// select count(*) from 
//     (select distinct silent_killers from 
//         (select player_b from server2 where key='KilledBy') as silent_killers) poop
//     where silent_killers not in 
//         (select distinct chatters from (select player_a from server2 where key='Chat') as chatters)

