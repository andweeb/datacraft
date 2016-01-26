function servercraft(id) {
    d3.csv(`data/servers/server${id}players.csv`, (error, data) => {
        if(error) throw error;
        console.log(JSON.stringify(data,null,2));
    });
}
