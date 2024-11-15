<template>
  <h4 id="contributor-title">本文贡献者</h4>
  <div id="contributors">
    <div v-for="person in contributorList" class="contributor">
      <img :src="`https://github.com/${person.username}.png`" class="avartar" />
      <span class="nickname">{{ person.nickname }}</span>
      <span class="username">{{ person.username }}</span>
      <a
        class="github-link"
        :href="`https://github.com/${person.username}/`"
        aria-label="github"
        target="_blank"
      ></a>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watchEffect, ref } from "vue";
import { fullContributorList } from "../../util";
import { useData } from "vitepress";
import type { Contributor } from "../../util";
const { frontmatter } = useData();
const contributorList = ref(<Contributor[]>[]);
function print(a: any) {
  return a;
}

watchEffect(() => {
  contributorList.value = Array.from(
    new Set(
      print(
        (<string>frontmatter.value.contributorList)
          .split(",")
          .map((md5) =>
            fullContributorList.find(({ emailHash }) => emailHash.includes(md5))
          )
      )
        .filter((person) => person !== undefined)
        .reverse()
    )
  );
});
</script>

<style>
#contributor-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 20px;
}

#contributors {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  gap: 16px;
  margin: 15px 0;
}

.contributor {
  position: relative;
  padding: 15px 37px 15px 65px;
  width: max-content;
  height: 70px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  line-height: 20px;
  flex-grow: 1;
  flex-basis: 200px;
}

@media (min-width: 640px) {
  .contributor {
    max-width: calc(50% - 8px);
  }
}

.contributor .avartar {
  position: absolute;
  margin-right: 10px;
  border-radius: 50%;
  top: 15px;
  left: 15px;
  height: 40px;
}

.contributor .nickname {
  font-weight: bold;
  display: block;
}

.contributor .username {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.contributor .github-link {
  display: block;
  position: absolute;
  right: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  mask: url("https://api.iconify.design/simple-icons/github.svg");
  mask-size: 100% 100%;
  background-color: var(--vp-c-text-3);
  transition: background 0.2s;
}

.contributor .github-link:hover {
  background-color: var(--vp-c-text-2);
}

.contributor .github-link:active {
  opacity: 0.5;
}
</style>
