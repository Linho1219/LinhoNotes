<script setup lang="ts">
/// <reference path="../types.d.ts" />
import axios from "axios";
import { baseUrl } from "../util";
if (!import.meta.env.SSR) {
  const id = window.location.search.match(/\?q=(.{10})$/)?.[1] ?? false;
  if (id)
    axios.get("/shortmap.json").then((res) => {
      window.location.href = `${baseUrl}/${encodeURI(res.data[id])}`;
    });
  else {
    window.location.href = `${baseUrl}/404`;
  }
}
</script>
