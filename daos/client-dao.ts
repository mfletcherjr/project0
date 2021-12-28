/*
Data Access Object
an object/class that is responsible for saving an object (information)
This is the actual implementation of saving something
Think Database in spirit
should support basic CRUD operations:
Create
Read
Update
Delete

Suggested to create interface to define the above and then a class to implement the
interface

*/
import { CosmosClient, Database } from "@azure/cosmos";
import Client from "../entities/client";
import Account from "../entities/account";
import NotFoundError from "../entities/notfounderror";
import {v4} from 'uuid';

//import {readFile, writeFile} from 'fs/promises'; for local file management ONLY
const clientDB = new CosmosClient(process.env.COSMOS_CONNECTION); // this is talking to the DB
const fido = clientDB.database("project0");
const bucket = fido.container("clients");


export default interface ClientDAO{
   //CREATE new client and associated account used for POST
    createClient(client: Client): Promise<Client>; //how to have this make an account? feature is a property of client itself and not needed to instantiate the actual client

  
    //READ customer information used for GET method
     getAllClients():Promise<Client[]>; //returns array of client
     getClientById(id:string):Promise<Client>; //searches client objects for a given client by unique id
    // getBalanceInformation(balance:number):Promise<Account["balance"]> // retrieve balance of client 
    // getAccountType(accountType:string):Promise<Account["accountType"]>; //returns the type of account the client has

    //UPDATE client information will be used for PUT
    //updateClient(client:Client):Promise<Client>;

   //DELETE remove client used for DELETE
    deleteClientById(id:string):Promise<Boolean>;

    //PATCH used to deposit or withdraw funds from client account
    // patchBalance(balance:number):Promise<Account["balance"]>;

}

 export class ClientDao implements ClientDAO{
    /*
    creates new client in the cosmos DB
    invokes v4 to generate unique user id
    requires first name, last name, balance to begin with, and account type
        - checking or vacationFund from example 

    */

    async createClient(client:Client):Promise<Client>{
       client.id=v4();
        // Push the accounts to the client accounts array.
        const clientData = await bucket.items.create(client);
        return clientData.resource;
    } 

    /*
    returns all clients in the cosmos DB
    returns uuid, first name, last name, balance, account type from creation

    */
    async getAllClients():Promise<Client[]>{
        const clientData = await bucket.items.readAll<Client>().fetchAll();
        return clientData.resources;

    }

    /*
    returns a particular/given client
    based on their provided clientID (uuid generated)

    */

    async getClientById(clientID: string): Promise<Client> {
     
        
        const client = await bucket.item(clientID,clientID).read<Client>();
            
        // if the response.resource is undefined it means you did not fetch anything
        if(!client.resource){
            throw new NotFoundError("Resource could not be found", clientID);
        }
        // is there a shorter syntax to get an object with these specific properties
        const {id, fname, lname, accounts} = client.resource;   
        return {id, fname, lname, accounts};
    }

 /*
    deletes a particular/given client
    based on their provided clientID (uuid generated)

    */
    async deleteClientById(clientID: string): Promise<Boolean> {
        //requires getClientById to function correctly is DONE, now to implement
        //here so that it pulls single client for deletion
        const client = await this.getClientById(clientID);
        const response = await bucket.item(clientID,clientID).delete();
        return true;

    }
 }//end of ClientDao

    