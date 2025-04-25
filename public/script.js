const socket = io();
socket.on("connect",()=>{
    console.log("conectado");
})
axios.post("/server",{ei:"teste"}).then(response=>{
    console.log(response.data);
});