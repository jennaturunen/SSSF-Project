# SSSF-Project
Server-side scripting frameworks, course project

- Link to front-end http://jt-test-app.jelastic.metropolia.fi/

Test users for easy login:
- username: test_personal, password: Personal123
- username: test_company, password: Company123

**You should be able to test everything on front-end, to see some changes you need to refresh the page.**

Things to test:
- Login/register (password should be at least 8 letters + one uppercase letter)/logout
- View posts + pagination
- Filter posts by manufacturer and/or keywords
- Open one post to bigger modal to see the details (click image)
- Add comments
- Add new post
- On Your page you can modify own posts and delete comments or whole post
- Edit users full name and description
- Company accounts can set their location
- On 'Find entrepreneurs'-tab, you can see all users (companies) that have set the location, click marker to open popup and details of the company
- Filter companies on the map by username and/or description field

- Link to test GraphQL: https://jt-test-app.jelastic.metropolia.fi/graphql


**Changes made after presentation:**
- Correct cursor for navigation links
- Fixed maps z-index (not blocking modify-modals content)
- Show password requirements
- Animation when hovering over card/post on main feed



The app is designed for people who are building their own Move-In-Ready house in Finland. People can share their experiences of everything related to construction, for example recommendations, pictures, what didn't go as planned and some nice-to-know facts for those who are still planning their project.

User can post pictures/posts and keep a construction-diary in the app. Users can find easily other people that are building or have built their houses with the same house package ('talopaketti') or with the same company. 

Also companies and entrepreneurs can create their own account and advertise their services. They can also create posts and share pictures of their references. They can also mark their work-area on the map, so people that are building near by can easily find and use their services.

Techniques used:
- Node, Express
- MongoDb, Mongoose, Apollo Server
- GraphQL
- Passport, brycpt, jsonwebtoken
- HTML, CSS, JavaScript + Bootstrap and jQuery
- Filepond

<h2>Example GraphQL-requests</h2>

**Register User**

```mutation Variables($username: String!, $password: String!, $password_second: String!, $full_name: String, $account_type: String!){
  registerUser(
    username: $username,
    password: $password,
    password_second: $password_second,
    full_name: $full_name,
    account_type: $account_type
  )
  {
    id
		username
    full_name
    account_type
  }
}```


**Login**

```query {
  login(username:"", password:"") {
    id
    username
    token
  }
}```


