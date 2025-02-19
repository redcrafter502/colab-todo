<script lang="ts">
  import ToDoList from "./ToDoList.svelte"
  import {Route, Router} from "svelte-routing";
</script>

<Router>
  <Route>
    <h1>HOME NO REDIRECT</h1>
  </Route>
  <Route path="/:id" let:params>
    <main class="flex justify-center">
      <ToDoList id={parseInt(params.id)} />
    </main>
  </Route>
</Router>