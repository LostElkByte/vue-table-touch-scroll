<script setup>
const tabs = [
  {
    name: 'Example 1',
    componentName: 'DemoExample1',
  },
  {
    name: 'Example 2',
    componentName: 'DemoExample2',
  },
]

const defaultTab = tabs[0].name
</script>

<template>
  <ClientOnly>
    <div class="my-4 w-full rounded-lg border">
      <UiTabs :default-value="defaultTab">
        <UiTabsList class="w-full justify-start rounded-none border-b bg-muted/50 p-0">
          <UiTabsTrigger
            v-for="tab in tabs"
            :key="tab.name"
            :value="tab.name"
            class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
          >
            {{ tab.name }}
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent
          v-for="tab in tabs"
          :key="tab.name"
          :value="tab.name"
          class="m-0 p-0"
        >
          <div class="">
            <ComponentViewer :component-name="tab.componentName" />
          </div>
        </UiTabsContent>
      </UiTabs>
    </div>
  </ClientOnly>
</template>
