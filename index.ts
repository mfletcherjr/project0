import express, { response } from 'express';
import Client from "./entities/client";
import ClientDAO, { ClientDao } from './daos/client-dao';
import { stringify } from 'ts-jest';
import NotFoundError from './entities/notfounderror';


const app = express();
const clientDAO: ClientDAO = new ClientDao();
app.use(express.json());

//this where the MAGIC happens

/*
D'VON, GET THE TABLES

*/

/*
add client to the cosmos DB via postman using
POST VERB


*/
app.post('/clients', async (req, res)=>{
    const newClient: Client = req.body; 
    const client:Client = await clientDAO.createClient(newClient);//this is the ClientDAO waiting for and processing the new client
    res.status(201); //returns confirmation from DAO that the task was done successfully per Adam
    res.send(client); //actual return of the client from whatever the DAO sent me

})

/*
retrieve all clients from the cosmost DB via postman using
GET VERB

*/

app.get('/clients', async (req, res)=>{
    //   const response = req.query;
    const clientList: Client[] = await clientDAO.getAllClients();
    res.send(clientList);

})

/*
get a unique client from cosmos DB via postman using
uniqueID + GET VERB

*/


app.get('/clients/:id', async (req,res)=>{

    try {
        const {id} = req.params;
        const client: Client = await clientDAO.getClientById(id);
        res.send(client);
    } catch (error){
        if (error instanceof NotFoundError) {
            res.status(404);
            res.send('The provided ID could not locate client');
        } else {
            res.status(500);
            res.send("Something very wrong here"); 
        }
        
    }
});  


app.delete('/clients/:id', async (req, res)=>{
    const {id} = req.params;
    const deletedClient: Client = await clientDAO.deleteClientById(id)
    res.send("Deleted the client succesfully id: " + deletedClient.id);
});


app.listen(3000,()=> console.log("Application launched"));//End of File