<script lang="ts">
    import ToDoItem from "./ToDoItem.svelte";
    import { onMount } from "svelte";

    export let id: number;
    let socket: WebSocket | null;
    let name = "";
    let todoBeingAdded = "";
    let todos: {
        id: number;
        todo: string;
        completed: boolean;
    }[] = [
        {
            id: 0,
            todo: "Use Colab Todo",
            completed: false,
        },
    ];

    $: send("name-changed", name);

    async function send(cmd: string, msg: string) {
        console.log("sending", cmd, msg);
        if (socket == null) return;
        socket.send(`${cmd}:${msg}`);
    }

    onMount(function () {
        console.log(id);
        socket = new WebSocket(`ws://localhost:8080/ws?id=${id}`);

        socket.onopen = function () {
            console.log("Socket connected");
            send("init", "0");
        };

        socket.onerror = function (e) {
            console.log("Socket Error: ", e);
        };

        socket.onmessage = function (e) {
            console.log("received", e.data);
            const dataArray = e.data.split(":");
            const cmd = dataArray[0];
            const msg = dataArray.slice(1).join(":");

            switch (cmd) {
                case "init":
                    name = msg;
                    break;
                case "name-changed":
                    name = msg;
                    break;
            }
        };
    });

    function addTodo() {
        todos = [
            ...todos,
            {
                id:
                    todos.map((todo) => todo.id).sort((a, b) => a - b)[
                        todos.length - 1
                    ] + 1,
                todo: todoBeingAdded,
                completed: false,
            },
        ];
        todoBeingAdded = "";
    }

    function deleteTodo(id: number) {
        console.log(todos);
        console.log("Deleting Todo");
        todos = todos.filter((todo) => todo.id !== id);
    }
</script>

<div>
    <div class="flex border-4 border-gray-500 rounded-xl p-1">
        <input
            class="w-full focus:outline-none"
            bind:value={name}
            placeholder="Name of your Todo List ..."
        />
    </div>
    <form
        class="flex border-4 border-gray-500 rounded-xl p-1"
        on:submit|preventDefault={addTodo}
    >
        <input
            class="w-full focus:outline-none"
            bind:value={todoBeingAdded}
            placeholder="New Todo ..."
        />
        <button type="submit">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
        </button>
    </form>
    {#each todos as todo}
        <ToDoItem bind:todo {deleteTodo} />
    {/each}
    {todos.map((todo) => todo.todo)}
</div>
