# serie
versjon 2 av show reposetory. Bygget mer tankefull og med en økt forståelse av hvordan databaser fungerer.

Last updated 20.03.2026 (european calader)
# Rec-Watch 📺

***Rec-Watch*** is made to allow friend groups to recommend, and recive recommendations from eatch other, as well as letting users track what shows they have, want to, and are watching themself. 

- [Development Status](#development-status)
- [Design Process 🎨](#design-process-🎨)
- [Kode](#kode)
- [Features💡](#features-💡)
- [Technology](#technology)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Sources](#Sources)

## Standerds
I am still learining code, so to reduce confusion, and force myself to learn som new stuff, all varibles made by me vill end in a underscore_

If you see any varibles missing a underscore, feel free to fix them.

This might seem silly or stupid, but i find it helpfull, and therfor ask any contributers to also stick to said standerd.

## Development Status 
The project is in active development, but do to this being version 2.0 it has not gotten far into development, still being in the planing, and documenting phase. Coding will soon begin.

**Current Progress:**
- Core functionality: 10% ✅
- Security features: 20% 🔒
- UI/UX polish: 0% 🎨

## Design and Planing 🎨 
The hole design and plaing is based on the original 1.0 website. If you wish to view it then you can fined it under the 'Show' reposetory.

### Database
The database is a close copy of the original database used in rec-watch 1.0 with only a few small changes that include:
- Changes to names for ease of use and less confusion. Making understanding from a glance easy.
- Changed it so username (brukernavn)has the UNIQUE variable insted insted of nickname (kallenavn) who now has the NOT NULL variable.
- Added anbefaling.er_godkjent to help track if the recommondation should be moved to the watch list or not.  

Planing started on paiper, before being made into a proper model using draw.io.

![databasen laget i draw.io. Viser 4 tabeller som forklares videre under](bilder_md/draw_io_database.png)

Later made into a actual database with Maria.db.

### 🧑‍💻 User (bruker)

Stores information about users.

| Column      | Type    | Description     |
|-------------|---------|-----------------|
| bruker_id   | INTEGER | Primary key, autoincrement |
| brukernavn  | TEXT    | must be uniqe   |
| passord     | TEXT    | cannot be null  |
| kallenavn   | TEXT    | cannot be null  |
| beskrivelse | TEXT    | -               |
| bilde       | BLOB    | -               |

### 🧑‍💻 Show (serie)

Stores information about shows.

| Column       | Type    | Description     |
|--------------|---------|-----------------|
| serie_id     | INTEGER | Primary key, autoincrement|
| navn         | TEXT    | -               |
| beskrivelse  | TEXT    | -               |
| utgivelses_arr| INTEGER| -               |
| andmeldelse  | INTEGER | -               |  
| bilde        | BLOB    | -               |

### 🧑‍💻 Recommendations (anbefaling)

Stores information about what shows have been recommended to what users.

| Column        | Type       | Description     |
|---------------|---------   |-----------------|
| anbefaling_id | INTEGER    | Primary key,autoincrement|
| kommentar     | TEXT       | -               |
| er_godtatt    | INTEGER    | NULL            |
| serie_id      | INTEGER    | FOREIGN KEY     |
| mottaker_id   | TEXT       | FOREIGN KEY     |
| sender_id     | INTEGER    | FOREIGN KEY     |

showID connects to show idS
senderID connects to user id
reciverID connects to user id

### 🧑‍💻 showStatus (serieStatus)

Shows the "status" of a show. Either "to watch", "have watched", "watching".

| Column     | Type    | Description     |
|------------|---------|-----------------|
| status_id  | INTEGER | Primary key,autoincrement|
| status     | INTEGER | -               |
| bruker_id  | INTEGER | FOREIGN KEY     |
| serie_id   | INTEGER | FOREIGN KEY     |

idS connects to show idS
idB connects to user id

### Design 
The design is yet to be determend, but will likely match the old one quite closely. The old one taking from older sosical media platforms, and other movie/show review websites.

## Usage
1. Make an account, but make sure not to use any real password, do to the website lacking hashing.
2. Log into your acount
3. Register whatever show you would like!
4. Send recommendations to your friends
5. Make your friends send some recommendations to (or send some to yourself)
6. Se what recomondations you have gotten, and get rid of the ones you don't like!

## Kode 

This time I am coding with Maria.db for the first time, insted of using SQLite. This is to (hopefully) learn how to use a program that has different requierments. It is also do to me hoping to have a server later where this website can sit, and Maria.db works (from my understanding) better for that.


## Features💡
### Implemented ✅
   #### Important ⚠️
- ✅ Hashing passwords
- ✅ Users can't change the id in the serchbare to access others account

   #### User 🧌
- ✅ User can make an account that includes a:
  - ✅username
  - ✅password
  - ✅nickname
- ✅ User can acces a alredy exicting account
- ✅  User has a "Home" page/ landing site that only they can access.
- ✅ User can delete their account when they so wish. 
   - ✅ all info from db is also deleted

   #### Website 🖥️
- ✅ User cannot access the landing page without an account.
- ✅ The landing page has all registerd (to user) shows
- ✅ Username visible at the top

   #### Show 📺
- ✅ Users able to search after shows based on id
- ✅ Users able to search after shows based on name of show
- ✅ There is no show ID in the serchbar (having a cleaner URL) 


  #### Extra
- ✅ There is no User ID in the serchbar (having a cleaner URL)

### To Be Implemented 🚧

   #### Important ⚠️
- ⬜ Users can't access the 'Private' folder
- ⬜ Transfer codes(pins), secrets and API keys to an .env document for incresed saftey

   #### User 🧌
- ⬜ Adding friends/friends list
- ⬜ Profile picture and bio

   #### Website 🖥️
- ⬜ Try to break in to private without an account 

   #### Show 📺
- ❌ User can register shows
  - ❌With pictures
  - ❌Can give shows rewiews
- ❌ User can see all registered shows on one page (Using api. Contains to many shows.)
- ⬜ User can with recommendations:
  - ◽ Send them
  - ◽ Receive them
  - ◽ Delete them
  - ◽Send them based on names and not ID
  - ◽delet the recommondation more then once
- ⬜ User can have a list for:
  - ◽Shows they have watched
  - ◽Shows they are watching
  - ◽Shows they want to watch 
- ⬜ Get more info on a show by clicking on poster
- ⬜ Show all shows with said name when searching 

  #### Extra
- ⬜ Translate all code to english 
  - ✅Private
  - ✅Public
  - ✅app.js
  - ◽Database
- ⬜ Adding a caching proxy for incresed staility

   #### Fix 🛠
- ⚠️ Shows with short ID's can not be searchd

### Future Ideas 💡
These are things that I can't impliment for the time being do to either my current skillsett or just lack of time.
* A show API so users don't have to manuely register shows.
* Adding groups, so you can recomend a show to more then one person at a time.

## Technology

- **Backend:** Node.js, Express.js
- **Database:** Maria.db
- **Frontend:** HTML, CSS, JavaScript

## Project Structure

```
Reposetory serie/

app.js      # Main server file
public/     # Container holding static files (CSS, images, JS) (to be added)
private/  # Container holding files that will be protected
README.md   # This file containing info on the website and development
package.json # Dependencies(to be added)
```

## Contributors
Thank you to the other students in my class who contributed to my website with their knowledge. Thank you especially to my teacher who helped make sense of my code and improve my idea.

## Author 

A large portion of the code is made by (me) 'Benny' also known as 'muunuo' on Github

I am curently a student in norway studying information technology (informasjonsteknologi) in high school (videregående skole)

-----
***Last updated***
- April 2nd 2026

# Sources

### Information
Stensland, John Scott (2017) answer on "What is the most elegant way to restrict users from accessing other users' content?" https://stackoverflow.com/questions/41287766/what-is-the-most-elegant-way-to-restrict-users-from-accessing-other-users-conte gotten 27 March 2026

### Code snippets
niklhs (2021) answer on "managing sessions on login nodejs" https://stackoverflow.com/questions/65644966/managing-sessions-on-login-nodejs gotten 02 April 2026

Hausnes, Jo Bjørnar (2026) "webutvikling" https://github.com/hausnes/webutvikling/tree/main gotten March 2026 