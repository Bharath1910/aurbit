# Aurbit

Aurbit is a fully functional clone of the popular forum website Reddit.

# Technology choices
As a backend developer, I thought of going with HTML/TailwindCSS/JS for the frontend and ExpressJS as the backend. But after some thought, I decided to try out HTMX. I checked their website and they linked this book [Hypermedia Systems](https://hypermedia.systems/). I decided to buy the book and sat down to read it. This was the first time I went in depth about hypermedia systems. 

I was surprised after learning about how many stuffs can be natively handled by the browsers. This is where I was introduced to the concept of HATEOAS as well, So I decided to go the HTMX route. The backend is ExpressJS with PostgresSQL database. I wanted to keep it simple because now my main focus about this project was to better understand Hypermedia Systems, HATEOAS and the true nature of RESTfull APIs.

# Journal

- **30/06/2024:** Completed a basic signup and login page
---

- **01/07/2024:** Database schema setup
The main requirements for the projects are
1. Having communities (subreddits)
2. Users can join/leave communities
3. Users can post in communities
4. Users can comment on posts
5. Users should have a profile page which has a bio and profile picture

After considering the requirements, I came up with the following schemas

For users,
```prisma
model users {
  username String    @id
  password String
  pfp      String?
  aura     Int       @default(0)
  bio      String?
  joined   members[]
}
```

- `username` as the primary key, so that we can have a database level uniqueness constraint on the username.
- `password` field is the hashed password of the user. The hashing is done by bcrypt.
- `pfp` is the profile picture of the user. It is optional. I'm planning to use supabase object storage to store the profile pictures.
- `aura` is the karma of the user. The algorithm to calculate aura is not yet decided. But it will be based on the upvotes and downvotes the user gets.
- `bio` is the bio of the user. It is optional.

For communities,
```prisma
model communities {
  name          String    @id
  description String?
  posts       posts[]
  members     members[]
}
```

- `name` name of the community. It is the primary key, to have a database level uniqueness constraint on the name.
- `description` is the description of the community. It is optional.

For posts,
```prisma
model posts {
  id           String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  community_id String
  title        String
  content      String?
  upvotes      Int     @default(0)
  downvotes    Int     @default(0)
  image        String?

  community communities @relation(fields: [community_id], references: [name])
}
```

- `id` is the primary key of the post. It is a UUID generated by the database. I didn't use the "uuid()" function because it is not database generated, rather its generated by prisma client. And I am not using the prisma client for this project.
- `community_id` is the foreign key to the communities table. It links the post to a specific community.
- `title` is the title of the post.
- `content` is the content of the post. It is optional.
- `upvotes` is the number of upvotes the post has.
- `downvotes` is the number of downvotes the post has.
- `image` is the image of the post, the image will be stored in supabase object storage.


To keep track of the members joining the communities, I thought of creating a seperate table called members, where the username and community name will be the primary key. This way we can keep track of the members joining the communities.
And having both the username and community name as the primary key, we can have a database level uniqueness constraint on the username and community name, which makes sure that a user can join a community only once.

This also makes it easier to query the members of a community and the communities, which reduces having a seperate member count column in the communities table.
```prisma
model members {
  community_id String
  username     String

  user      users       @relation(fields: [username], references: [username])
  community communities @relation(fields: [community_id], references: [name])

  @@id([username, community_id])
}
```

After completing the schema, I was going through the public login and signup page, I felt like the pages have 2 sources. What im trying to say is, the login page in the public directory has an HTML and the login page returned from the server also has the same HTML. It is not DRY code. I wanted to keep these HTMLs single source, so I decided to use HTMX with `hx-trigger="load"` to fetch the login and signup pages from the server. This way I can keep the public directory clean.

The requests are even cached with `Cache-Control` header, so that the browser and proxy servers can cache these requests. This way the page load time and load on the server is reduced.


# API Documentation

The API for this projects starts with `/api`. It tries to follow all RESTful API standards. I also tried to make it as much self discoverable as possible. The endpoints marked with `(A)` are authenticated endpoints.

### /login
- `GET /login` - It retrieves the login html component
- `POST /login` - Its used to login a user

### /signup
- `GET /signup` - It retrieves the signup html component
- `POST /signup` - Its used to signup a user

### /interfaces
The interfaces are user interactive components like navbar, sidebar etc. I used this to keep the code as DRY as possible, since there are no reusable components like react components in this project.

- `GET /interfaces/navbar` - It retrieves the navbar html component
- `GET /interfaces/sidebar` - It retrieves the sidebar html component 

### /posts
- `GET /posts` - It retrieves posts 
- `POST /posts` - It creates a post (A)
- `GET /posts/:id/comments` - It retrieves the root comments of a post

### /comminity
- `POST /community/new` - It creates a community (A)

### /comments
- `GET /comment/:id/replies` - Fetches the replies of a comment