$(document).ready(function () {
    $(".myform").hide();
    $(".myText").hide();
    $(".dbButton").hide();

    var starValue;
    var movieId;
    var newMovieId;
    var allMoviesArray = [];
    var moviesArray = [];

    $("label").on("click", function () {
        starValue = parseInt(this.id);
        console.log(starValue);
    });

    function displayPosters() {
        var queryURL = "https://api.themoviedb.org/3/movie/top_rated?api_key=6dab14e95b96319c6b9d19d21edcbaaa";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            for (var i = 9; i > 0; i--) {
                let cardID = "card-" + (i - 1);
                var randomImage = response.results[i].poster_path
                var randomURL = "https://image.tmdb.org/t/p/w200" + randomImage;
                $("#" + cardID).find("img").attr("src", randomURL);
                $("#" + cardID).find(".card-title").text(response.results[i].title);
                $("#" + cardID).find(".card-action").attr("href", randomURL);
            }
        })
    }


    $("#add-movie").on("click", function (event) {
        event.preventDefault();
        $(".posterContainer").hide();
        $(".myText").show();
        $(".dbButton").show();
        $(".blogContainer").show();
        chosenMovie = $("#movie-input").val().trim();
        chosenMovie = chosenMovie.replace(/\s/g, "_");
        displayChosenMovie();
        getSearchedBlogs(chosenMovie)

    });



    $(".dbButton").on("click", function (event) {
        event.preventDefault();


        $.get("/api/movie").then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var foundMovie = String(data[i].movie_name.toLowerCase())
                console.log({ foundMovie })
                moviesArray.push(foundMovie)

                if (moviesArray.includes(chosenMovie)) {
                    console.log("there is another match?")

                    movieId = data[i].id
                    console.log({ movieId })
                    return movieId

                }


            }
            console.log({ movieId })

        }).then(function () {
            console.log("whats movie id now? " + movieId)
            var newBlog = {
                name: $("#name").val().trim(),
                blog: $(".blog-box").val().trim(),
                rating: starValue,
                MovieId: movieId

            };

            console.log({ newBlog })
            console.log("whats my name? " + JSON.stringify(newBlog.name))
            console.log("what is newBlog ?" + JSON.stringify(newBlog));



            $.post("/api/blog", newBlog)
                // On success, run the following code
                .then(function () {
                    var AmendedName = JSON.stringify(newBlog.name);
                    var AmendedBlog = JSON.stringify(newBlog.blog);
                    var AmendeRating = JSON.stringify(newBlog.rating);



                    var newRow = $("<div>");
                    newRow.addClass("blog");
                    newRow.append("<p>" + AmendedName + " reviewed " + chosenMovie + "</p>");
                    newRow.append("<p>" + AmendedBlog + "</p>");
                    newRow.append("<p>" + AmendeRating + " star rating! </p>");
                    $("#blog-area").prepend(newRow);


                })

            $("#name").val("");
            $(".blog-box").val("");

        })


    })



    function getSearchedBlogs(chosenMovie) {
        console.log("marry " + chosenMovie)


        $.get("/api/movie").then(function (response) {
            console.log({ response })
            for (var i = 0; i < response.length; i++) {
                var allMovies = String(response[i].movie_name).toLowerCase()
                // console.log({ allMovies })
                allMoviesArray.push(allMovies)
                // console.log({ allMoviesArray })

                if (allMoviesArray.includes(chosenMovie)) {
                    console.log("there is a  match?")

                    newMovieId = parseInt(response[i].id)
                    console.log(newMovieId)
                    return newMovieId

                }
            }

        }).then(function (newMovieId) {

            // When the page loads, grab all of our blogs
            $.get("/api/movie/" + newMovieId, function (data) {

                console.log({ data })

                // if (data.Blogs.length !== 0) {
                // console.log({ data })
                for (var i = 0; i < data.Blogs.length; i++) {
                    console.log(data.Blogs.length)
                    // if (data.Blogs.length !== 0) {
                    var row = $("<div>");
                    row.addClass("blog");
                    row.append("<p>" + data.Blogs[i].name + " reviewed " + chosenMovie + "</p>");
                    row.append("<p>" + data.Blogs[i].blog + "</p>");
                    row.append("<p>" + data.Blogs[i].rating + " star rating! </p>");

                    $("#blog-area").prepend(row);

                    // } else {
                    //     break;
                    // }

                }
                // }
            });


        })


    }


    function getAllBlogs(chosenMovie) {
        $.get("/api/movie").then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (chosenMovie == data[i].movie_name) {
                    movieId = data[i].id;
                    console.log({ movieId })
                    return movieId

                }
            }
        }).then(function (movieId) {
            // When the page loads, grab all of our blogs
            $.get("/api/movie/" + movieId, function (data) {

                console.log({ data })

                // if (data.length !== 0) {
                console.log({ data })
                for (var i = 0; i < data.Blogs.length; i++) {
                    var row = $("<div>");
                    row.addClass("blog");
                    row.append("<p>" + data.Blogs[i].name + " reviewed " + chosenMovie + "</p>");
                    row.append("<p>" + data.Blogs[i].blog + "</p>");
                    row.append("<p>" + data.Blogs[i].rating + " star rating! </p>");

                    $("#blog-area").prepend(row);
                }
                // }
            });


        })
    }









    function displayChosenMovie() {
        $(".posterContainer").hide();
        $(".myText").show();

        console.log("what's chosen movie" + chosenMovie)
        var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=6dab14e95b96319c6b9d19d21edcbaaa&query=" + chosenMovie;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            var posterDiv = $("<div class='movie'>");
            // Retrieving the URL for the image
            var choseMovieImage = response.results[0].poster_path;

            var chosenMovieName = response.results[0].title;
            console.log("what's chosen movie? " + chosenMovieName)
            var imgURL = "https://image.tmdb.org/t/p/w200" + choseMovieImage;
            // Creating an element to hold the image
            var image = $("<img>").attr("src", imgURL);
            // Appending the image
            posterDiv.append(image);
            $("#movie-poster").prepend(posterDiv);

            var chosenMovieJSON = {
                movie_name: chosenMovieName


            };

            $.post("/api/movie", chosenMovieJSON)
                // console.log("new blog after post " + newBlog)
                // On success, run the following code
                .then(function () {
                    var row = $("<div>");
                    row.addClass("blog");
                    row.append("<p>" + chosenMovieJSON.movie_name + " reviewed: </p>");
                    // row.append("<p>At " + moment(newBlog.created_at).format("h:mma on dddd") + "</p>");
                    $("#blog-box").prepend(row);

                })
        })


    }

    $(".card-image").click(function (event) {
        event.stopPropagation();
        $(".dbButton").show();
        $(".blogContainer").show();
        chosenMovie = $(this).find(".card-title").text();
        console.log(chosenMovie)
        displayChosenMovie();
        getAllBlogs(chosenMovie)


    })

    displayPosters();

    //document.ready root, don't go over this

})
