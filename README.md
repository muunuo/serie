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

## Standerds
I am still learining code, so to reduce confusion, and force myself to learn som new stuff, all varibles made by me vill end in a underscore_

If you see any varibles missing a underscore, feel free to fix them.

This might seem silly or stupid, but i find it helpfull, and therfor ask any contributers to also stick to said standerd.

## Development Status 
The project is in active development, but do to this being version 2.0 it has not gotten far into development, still being in the planing, and documenting phase. Coding will soon begin.

**Current Progress:**
- Core functionality: 0% ✅
- Security features: 0% 🔒
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

- ✅ User can make an account that includes a:
  - ✅username
  - ✅password
  - ✅nickname

### To Be Implemented 🚧

   #### Important ⚠️
   - ⬜ Hashing passwords
   - ⬜ Private means users can't access it
   - ⬜ Users can't change the id in the serchbare to access others account
   #### User 🧌
- ⬜ User can acces a alredy exicting account
- ⬜  User has a "Home" page/ landing site that only they can access.
- ⬜ Adding friends/friends list
- ⬜ Profile picture and bio

   #### Website 🖥️
- ⬜ User cannot access the landing page without an account.
- ⬜ The landing page has all registerd shows
- ⬜ Username visible at the top

   #### Show 📺
- ⬜ User can register shows
  - ◽With a picture 
- ⬜ User can see all registered shows 
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
- ⬜ Get more info on a show by clicking 
- ⬜ Translate all code to english
  - ✅Public
  - ✅Private
  - ✅app.js
  - ◽database


  #### Other
- ⬜ Translate all code to english 
  - ✅Private
  - ✅Public
  - ✅app.js
  - ◽Database

### Future Ideas 💡
These are things that I can't impliment for the time being do to either my current skillsett or just lack of time.
* A show API so users don't have to manuely register shows.
* Adding groups, so you can recomend a show to more then one person at a time.

## Technology

- **Backend:** Node.js, Express.js
- **Database:** SQLite 
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

Benny

muunuo on Github

-----
***Last updated***
- March 11th 2026