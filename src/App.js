import './App.css';
import Web3 from 'web3'
import {useEffect, useState} from "react";
import {TODO_LIST_ABI, TODO_LIST_ADDRESS} from './config'

function App() {

    const [account, setAccount] = useState(); // state variable to set account.
    const [tasks, setTasks] = useState([]); // state variable to set account.
    const [contract, setContract] = useState([]); // state variable to set account.

    useEffect(() => {
        loadBlockchainData();
    }, []);

    async function loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
        web3.eth.getAccounts()
            .then( accounts => {
                console.log("acccounts: ", accounts)
                setAccount(accounts[0])
            });
        const todoListContract = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
        setContract(todoListContract)
        await reloadTasks()
    }

    async function reloadTasks() {
        const tc = await contract.methods.taskCount().call()
        console.log("taskCount ", tc)
        let tasksArray = [];
        for (let i = 1; i <= tc; i++) {
            const task = await contract.methods.tasks(i).call()
            tasksArray.push(task)
        }
        setTasks(tasksArray);
    }

    async function createTask() {
        await contract.methods.createTask("Task !!!").send({from: account})
        await reloadTasks()
    }

    return (
        <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
            <div class="row m-1 p-4">
                <div class="col">
                    <div class="p-1 h1 text-primary text-center mx-auto display-inline-block">
                        <i class="fa fa-check bg-primary text-white rounded p-2"></i>
                        <u>My {account}</u>
                    </div>
                </div>
            </div>
            <div class="row mx-1 px-5 pb-3 w-80">
                <div class="col mx-auto">
                    {
                        tasks.map(task =>
                            (
                               <h3 key={task.id}>{task.content}</h3>
                            )
                        )
                    }

                </div>
                <button onClick={createTask}>Cjreate task</button>
            </div>

        </div>
    );
}

export default App;
