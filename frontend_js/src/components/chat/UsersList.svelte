<script>
  export let users = [
    {
      name: "Paul"
    },
    {
      name: "trucmuch"
    },
    {
      name: "marie"
    },
    {
      name: "Zaziiie 68+1 ^^"
    },
    {
      name: "Paula & jean"
    },
  ];
  export let open;
  export let search = '';
  $: filterUsers = Object.entries(users).filter(([key, user]) => {
    const regex = /\s/g; // remove all spaces
    return user['name'].toLowerCase().replace(regex,'').indexOf(search.toLowerCase().replace(regex,'')) > -1;
  });
</script>

{#if users}
<style lang="scss">@import '../../styles/components/chat/users-list.scss';</style>

<div>
  <h2>Users</h2>
  <div>
    <input type="text" label="Recherche un user" bind:value={search}>
  </div>

  <ul class:open={open}>
    {#each filterUsers as [key, user]}
      <li>
        <img src="{user.thumb}" alt="{user.name} image">
        <div>
          <strong>{user.name}</strong>
          <p>message</p>
        </div>
      </li>
    {/each}
  </ul>
</div>
{/if}