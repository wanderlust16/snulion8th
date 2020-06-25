// 추가
$(document).ready(() => {
    $('.fold').click((e) => {
        const $this = $('.fold');
        // e.stopPropagation();
        if($(e.currentTarget).css('height') > '10px') { // e.currentTarget도 먹힘
            $this.css({
                'height': '10px',
                'cursor': 'pointer',
            });
            $this.children().css('display', 'none');
        } else {
            $this.css({
                'height': 'auto',
                'cursor': 'default',
            })
            $this.children().css('display', 'block');
        }
    })
    $('.fold-inner').click((e) => {
        e.stopPropagation();
    })
})

$(".feed-like").click((e) => {
    e.preventDefault();
    const $this = $(e.currentTarget);
    const fid = $this.data('fid');
    const csrfmiddlewaretoken = $this.data('csrfmiddlewaretoken');
    console.log(fid);
    $.ajax({
        url: `/feeds/${fid}/like/`,
        type: "POST",
        data: {
            fid: fid,
            csrfmiddlewaretoken: csrfmiddlewaretoken,
        },
        dataType: "json",
        success: function(data) {
            // console.log(data);
            // 현재 페이지로 돌아가는 코드
            window.location.reload();
            
        },
        error: function(response, status, error) {
            // alert("error");
            console.log(response, status, error);
        },
        complete: function(response) {
            // alert('complete');
            // console.log(response);
        }
    })
});

// 완료
$('.comment-submit').submit((e) => {
    e.preventDefault();
    // console.log('form submitted');
    // $this가 안 먹힘 -> arrow function이라서! 
    const $this = $(e.currentTarget);
    const fid = $this.data('fid');
    const csrfmiddlewaretoken = $this.data('csrfmiddlewaretoken');

    $.ajax({
        type: 'POST',
        url: `/feeds/${fid}/comments/`, // django url template 사용 가능 "{% url "" %}""
        data: { // 사용되는 곳이 없는지? 
            fid: fid,
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            content: $(`input.${fid}[name=content]`).val(),
        },
        dataType: 'json',
        success: function(data) { // 여기 data는 views.py의 data(?)
            console.log(data);
            const str = `
                <div style="display: flex; flex-direction: row;" class="comment-box">
                    <div>${data.content}</div>
                    <a href="{% url "comment_like" id=${fid} cid=${data.id} %}" class="comment-like" data-cid=${fid}>0 Likes</a>
                        <form action="/feeds/${fid}/comments/${data.id}/" method="POST">
                        <button>댓글 삭제</button>  
                        </form>
                </div>
            `
            // const class_container = $('.comment-container') // 모든 피드에 댓글을 달아버림
            const comment_container = $this.siblings('.comment-container')
            comment_container.append(str);
            $("input[name=content]").val('') // clear current input
        },
        error: function(response, status, error) {
            alert('error');
            console.log(response, status, error);
            // window.location.replace("{% url 'feedpage:index' %}")
        },
        complete: function(response) {
            // alert('complete');
            console.log(response);
        },
    });
});

// 숙제?
$(".comment-like").click(() => {
    // alert("clicked comment like");
})

// 숙제?
$(".comment-delete").click(() => {
    // alert("clicked comment delete");
})

// 추가
$(".scroll-up").click((e) => {
    $(window).scrollTop(0);
})