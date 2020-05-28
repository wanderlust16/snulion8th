
$(".feed-like").click(() => {
    alert("clicked feed like");
    const fid = $this.data

    // feed_like(fid);
    $.ajax({
        url: `/${fid}/like/`,
        type: "POST",
        data: $this.data("fid"),
        dataType: "json",
        success: function(data) {
            console.log(data);
        },
        error: function(response, status, error) {
            alert("error");
            console.log(response, status, error);
        },
        complete: function() {
            alert('complete');
            console.log(response);s
        }
    })
});

$('.comment-submit').submit((e) => {
    event.preventDefault();
    console.log('form submitted');
    // this가 안 먹힘 ㅠㅠ
    const $this = $(this);
    const fid = $('.comment-submit').data('fid');
    const csrfmiddlewaretoken = $('.comment-submit').data('csrfmiddlewaretoken');

    $.ajax({
        type: 'POST',
        url: `/feeds/${fid}/comments/`, // django url template 사용 가능 "{% url "" %}""
        data: { // 사용되는 곳이 없는지? 
            fid: fid,
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            content: $("input[name=content]").val(),
        },
        dataType: 'json',
        success: function(data) { // 여기 data는 views.py의 data
            console.log(data);
            const str = `
                <div style="display: flex; flex-direction: row;" class="comment-box">
                    <div>${data.content}</div>
                    <a href="{% url "comment_like" id=${fid} cid=${data.id} %}" class="comment-like" data-cid={{ ${fid} }}>0 Likes</a>
                        <form action="/feeds/{{ ${fid} }}/comments/{{ ${data.id} }}/" method="POST">
                        <button>댓글 삭제</button>  
                        </form>
                </div>
            `
            const class_container = $('.comment-container')
            class_container.append(str);
            $("input[name=content]").val('') // clear current input
        },
        error: function(response, status, error) {
            alert('error');
            console.log(response, status, error);
            // window.location.replace("{% url 'feedpage:index' %}")
        },
        // complete: function(response) {
        //     alert('complete');
        //     console.log(response);
        // },
    });
    });

$(".comment-like").click(() => {
    alert("clicked comment like");
})

// function feed_like(fid) {
//     console.log("clicked feed-like");
//     $.ajax({
//         url : `/${fid}/like/`,
//         type : "POST", // http method
//         data : { the_post : $('#post-text').val() }, // data sent with the post request

//         // handle a successful response
//         success : function(json) {
//             $('#post-text').val(''); // remove the value from the input
//             console.log(json); // log the returned json to the console
//             console.log("success"); // another sanity check
//         },

//         // handle a non-successful response
//         error : function(xhr,errmsg,err) {
//             $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
//                 " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
//             console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
//         }
//     })
// }
