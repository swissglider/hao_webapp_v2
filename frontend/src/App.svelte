<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./Home.svelte";
  import About from "./About.svelte";
  import Status from "./Status.svelte";
</script>

<main class="container">
  <Router>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/">Svelte App</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <Link class="nav-link" to="/">Home</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/about">About</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/status">Status</Link>
          </li>
        </ul>
      </div>
    </nav>

    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/status" component={Status} />
  </Router>
</main>

<style>
  main {
    padding: 2em;
  }
</style>
