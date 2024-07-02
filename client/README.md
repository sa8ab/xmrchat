# XMRChat Nuxt 3

Package manage: npm

## Development

```bash
npm install
npm run dev
```

### What is it using

`axios` for API requests
[Nuxt UI](https://ui.nuxt.com/) for ui elements

### Components

Components are auto imported using their name. You can also explicitly import them from '#imports' provided by nuxt.

### API

`axios` is used for sending API requests. the instance is created on axios.ts plugin can be accessed with `useApp` composable.

All api requests are placed `useServices` composable. so in general you won't need to use axios directly in the code.

### Error handling & Success Handling

Client side errors are handlded using `useErrorHandler` composable. Successful messages are rendered using `useSuccessHandler`

Server side errors ( `useAsyncData` errors ) is handled using `<PendingView />` component.

### Routing

All the routes are specified in `useRouteLocation` composable. To pass to a button, call the route

```ts
const { myRoute } = useRouteLocation();
```

```vue
<MyLink :to="myRoute()" />
```

to use it programatically get the path

```ts
const { myRoute } = useRouteLocation();
return navigateTo(myRoute().path);
```
