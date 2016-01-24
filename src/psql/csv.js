// Copy contents of the table to a file
// COPY (select * from server${i} order by start_t) TO '/Users/askwon/Sites/datacraft/data/servers/server${i}.csv'
for(var i = 1; i <= 14; i++) {
    process.stdout.write(`COPY (select * from server${i} order by start_t) TO '/Users/askwon/Sites/datacraft/data/servers/server${i}.csv' DELIMITER ',' CSV HEADER;`);
}

