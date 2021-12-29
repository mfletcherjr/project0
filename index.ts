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

 /*
    returns a particular/given client
    based on their provided clientID (uuid generated)

    */
app.get('/clients/:id', async (req,res)=>{

    try {
        const {id} = req.params;
        const client: Client = await clientDAO.getClientById(id);
        res.send(client);
    } catch (error){
        if (error instanceof NotFoundError) {
            res.status(404);
            res.send('The provided ID could not locate client.');
        } else {
            res.status(500);
            res.send("Something very wrong here!!!!!"); 
        }
        
    }
});  

 /*
    deletes a particular/given client
    based on their provided clientID (uuid generated)

    */
app.delete('/clients/:id', async (req, res)=>{
   try {
    const {id} = req.params;
    const deletedClient: Boolean = await clientDAO.deleteClientById(id)
    res.status(200);
    res.send("Deleted the client");
   } catch (error) {
       if (error instanceof NotFoundError) {
           res.status(404);
           res.send("The provided ID could not locate client for removal.");
       } else {
        res.status(500);
        res.send("Something very wrong here!!!!!"); 
       }   

   }
});

app.put('/clients/:id',async (req,res) => {
    try {
        const client: Client = req.body;
        const {id} = req.params;
        client.id = id;
        const editedClient: Client = await clientDAO.updateClient(client);
        res.send(editedClient);
       
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404);
            res.send("The provided ID could not locate client for update.");
        } else {
         res.status(500);
         res.send("Something very wrong here!!!!!"); 
        }   
    }
})

app.listen(3000,()=> console.log("Application launched"));//End of File