
/* ==============================
   CHEMVERSE - MAIN
============================== */

import { initializeNavigation } from "./navigation.js";
import { initializePeriodicTable } from "./periodic_table.js";


document.addEventListener("DOMContentLoaded", async () => {

    console.log("CHEMVERSE initialized!");

    initializeNavigation();

    await initializePeriodicTable();

    console.log("Periodic table loaded!");

});
