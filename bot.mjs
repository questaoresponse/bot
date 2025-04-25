// const { Bot } = require("./functions.mjs");
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
import { Bot } from "./functions.mjs";
import express from "express";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const bot = new Bot();

app.use(express.static(import.meta.dirname +"/public"));

app.get("/", (req,res)=>{
    res.sendFile(import.meta.dirname + "/public/main.html");
});
app.post("/server",(req,res)=>{
    res.send("eita cara");
});
io.on("connection",(conn)=>{
    bot.connections.push(conn);
    console.log("conectado");
    conn.on("disconnect",()=>{
        bot.connections = bot.connections.filter(connection => connection.id != conn.id);
        console.log("disconect");
    });
});

server.listen(12345, (err)=>{
    console.log("rodando");
});