<script>
  import { onMount } from "svelte";

  let statusMessage = "Lade...";

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ha");
      const data = await response.json();
      console.log(data); // Ausgabe des gesamten Response in der Konsole
      statusMessage = data.message;
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error);
      statusMessage = "Fehler beim Laden der Daten";
    }
  });
</script>

<main class="container">
  <h1 class="text-center">Home Assistant Status</h1>
  <div class="alert alert-info text-center" role="alert">
    {statusMessage}
  </div>
</main>

<style>
  main {
    padding: 2em;
  }

  h1 {
    color: #007bff;
  }
</style>
