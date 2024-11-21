<template>
  <h4 v-if="displayEnabled" id="contributor-title">本文贡献者</h4>
  <div
    id="contributors"
    v-if="displayEnabled"
    :class="
      contributorList.length % 3 && !(contributorList.length % 2) ? 'row-2' : ''
    "
  >
    <div v-for="person in contributorList" class="contributor">
      <img :src="`/avatars/${person.username}.png`" class="avatar" />
      <span class="nickname">{{ person.nickname }}</span>
      <span class="username">{{ person.username }}</span>
      <a
        class="github-link vpi-social-github"
        :href="`https://github.com/${person.username}/`"
        aria-label="github"
        target="_blank"
      ></a>
    </div>
  </div>
  <div class="doc-source">
    <p class="VPDocSource">
      本文来源: <a :href="link" class="VPDocSourceLink">{{ link }}</a
      >，转载请标明出处。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref } from "vue";
import { useData } from "vitepress";
import md5 from "blueimp-md5";
import { globalConfig } from "../manualConfig";

type Contributor = {
  username: string;
  nickname: string;
};

const { page, frontmatter } = useData();
const displayEnabled = ref(true);
const contributorList = ref(<Contributor[]>[]);
const link = ref("");

watchEffect(() => {
  if (typeof frontmatter.value.contributorList !== "string") {
    displayEnabled.value = false;
    return;
  }
  contributorList.value = frontmatter.value.contributorList
    .split(";")
    .map((raw) => raw.split(","))
    .map(([nickname, username]) => ({ nickname, username }));
});
watchEffect(() => {
  const path = page.value.filePath.replace(/(index)?\.md$/, "");
  if (encodeURI(path).length < 10)
    link.value = `${globalConfig.baseUrl}/${encodeURI(path)}`;
  else link.value = `${globalConfig.baseUrl}/s?q=${md5(path).slice(0, 10)}`;
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
  #contributors.row-2 .contributor {
    min-width: calc(50% - 8px);
  }
}

@media (max-width: 640px) {
  .contributor {
    flex-basis: 100% !important;
  }
}

.contributor .avatar {
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
  --icon: url("https://api.iconify.design/simple-icons/github.svg");
  color: var(--vp-c-text-3);
  transition: background 0.2s;
}
.contributor .github-link:hover {
  background-color: var(--vp-c-text-2);
}
.contributor .github-link:active {
  opacity: 0.5;
}
.VPDocSource {
  font-weight: bold;
}
.VPDocSourceLink {
  color: var(--vp-c-brand);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.doc-source {
  display: none;
}
</style>
