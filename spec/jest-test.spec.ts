import Client from "../entities/client";
import ClientDAO, { ClientDao } from '../daos/client-dao';
import { stringify } from 'ts-jest';
import NotFoundError from '../entities/notfounderror';



describe("Client Dao Tests", ()=>{

    const clientDAO: ClientDao = new ClientDao()
    let savedClient:Client = null

    it("Should create a client", async ()=>{
        const noob: Client = {id:"" ,fname:"Bart", lname:"Simpson",accounts:[] }
        savedClient =  await clientDAO.createClient(noob);
        expect(savedClient.id).not.toBeFalsy();
    });

    it("Should get a client by ID", async ()=>{
        const retrievedClient: Client = await clientDAO.getClientById(savedClient.id);
        expect(retrievedClient.fname).toBe("Bart");
        expect(retrievedClient.lname).toBe("Simpson");
    });


    it("Should update a client", async () => {
        const updatedClient: Client = {id: savedClient.id, fname:"Steve", lname:"Rogers", accounts:[]}
     
        await clientDAO.updateClient(updatedClient);

        const retrivedClient: Client = await clientDAO.getClientById (updatedClient.id);
        expect(retrivedClient.fname).toBe("Steve")
    })

    it("should delete a client", async () => {
        await clientDAO.deleteClientById(savedClient.id)

        expect(async ()=> {
            await clientDAO.getClientById(savedClient.id)
        }).rejects.toThrowError(NotFoundError)
        
    })


})