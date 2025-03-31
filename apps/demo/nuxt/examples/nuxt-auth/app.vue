<script setup lang="ts">
import type { User } from './server/api/user/list.get';

const { loggedIn, user, session, clear, openInPopup } = useUserSession();

// this is a good example of a call to the BFF
// that needs authentication but NO authorization
const { data: secureData } = useFetch('/api/user/me');

// this is a good example of a call to the BFF
// that needs authentication AND authorization
const { data: secureUsers } = useFetch<User[]>('/api/user/list');
</script>

<template>
  <main>
    <section v-if="loggedIn">
      <h1>Login state with useUserSession hiding secure info</h1>
      <div>
        <h2>User Information</h2>
        <table class="info">
          <tbody>
            <tr>
              <th>Logged In</th>
              <td>{{ loggedIn }}</td>
            </tr>
            <tr>
              <th>Roles</th>
              <td>{{ user?.roles.join(', ') }}</td>
            </tr>
            <tr>
              <th>GitHub ID</th>
              <td>{{ user?.githubId }}</td>
            </tr>
            <tr>
              <th>Login</th>
              <td>{{ user?.login }}</td>
            </tr>
            <tr>
              <th>Secure Access Token</th>
              <td>
                {{
                  session.secure?.accessToken ??
                  'DO THIS, ACCESS TOKEN NOT ACCESSIBLE CLIENTSIDE'
                }}
              </td>
            </tr>

            <tr>
              <th>Secure Roles</th>
              <td>
                {{
                  session.secure?.roles ??
                  'DO THIS, SECRET ROLES NOT ACCESSIBLE CLIENTSIDE'
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button @click="clear">Logout</button>

      <h2>Session Information</h2>
      <p>
        Take a look at the exposed <strong>notSecureAccessToken</strong>, the
        secure data is not available
      </p>
      <pre>{{ session }}</pre>

      <div>
        <h2>Secure User Information from API</h2>
        <table class="info">
          <tbody>
            <tr>
              <th>GitHub ID</th>
              <td>{{ secureData?.user.githubId }}</td>
            </tr>
            <tr>
              <th>Login</th>
              <td>{{ secureData?.user.login }}</td>
            </tr>
            <tr>
              <th>Roles</th>
              <td>{{ secureData?.user.roles.join(', ') }}</td>
            </tr>
            <tr>
              <th>Secure Access Token</th>
              <td>{{ secureData?.secure?.accessToken }}</td>
            </tr>
            <tr>
              <th>Secure Roles</th>
              <td>{{ secureData?.secure?.roles.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div>
          <h1>
            Secure Users, only accessible after authentication and authorization
          </h1>
          <ul>
            <li v-for="user in secureUsers" :key="user.id">
              {{ user.firstName }} ({{ user.lastName }})
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-else>
      <h1>Not logged in</h1>
      <a href="/auth/github">Login with GitHub url</a>

      <br />
      <br />
      <button @click="openInPopup('/auth/github')">
        Login with GitHub Pop Up
      </button>
    </section>
  </main>
</template>

<style scoped>
.info {
  border-collapse: collapse;
  width: 100%;
  max-width: 600px;
  margin: 20px 0;
}
.info th,
.info td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.info th {
  background-color: #f4f4f4;
}
</style>
