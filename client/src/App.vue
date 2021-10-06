<template>
  <div class="container-fluid bg-dark h-100 pt-4 text-light">
    <div class="col-11 col-sm-10 col-xl-6 mx-auto full-height">
      <!-- Check-in -->
      <h4>Bausenberg Check-in</h4>

      <div class="row ms-0">
        <input
          type="text"
          class="form-control col"
          id="name"
          placeholder="Name"
        />

        <div class="btn-group col" role="group">
          <input
            type="radio"
            class="btn-check"
            name="btnradioclub"
            id="btn-rml"
            autocomplete="off"
            onchange="calculate()"
          />
          <label class="btn btn-outline-light" for="btn-rml">RML</label>

          <input
            type="radio"
            class="btn-check"
            name="btnradioclub"
            id="btn-dgc"
            autocomplete="off"
            onchange="calculate()"
          />
          <label class="btn btn-outline-light" for="btn-dgc">DGC</label>
        </div>
      </div>
      <div class="my-3">
        <div class="my-2 d-grid gap-2">
          <button type="button" class="btn btn-danger">Check In</button>
        </div>
      </div>
      <hr />
      <!-- Check-out -->
      <h4>Bausenberg Check-out</h4>
      <div class="btn-group col" role="group">
        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btn-regular-landing"
        />
        <label class="btn btn-outline-light" for="btn-regular-landing"
          >Landewiese</label
        >

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btn-alternate-landing"
        />
        <label class="btn btn-outline-light" for="btn-alternate-landing"
          >Notlandewiese</label
        >
        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btn-xc-landing"
        />
        <label class="btn btn-outline-light" for="btn-xc-landing"
          >Ganz woanders 🥳 🚀</label
        >
      </div>
      <div class="my-3">
        <div class="my-2 d-grid gap-2">
          <button type="button" class="btn btn-success">Check out</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
html,
body {
  height: 100vh;
}

.full-height {
  height: 100vh;
}

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #2c3e50;
} */
</style>
