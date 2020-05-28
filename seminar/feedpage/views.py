from django.shortcuts import render
from .models import Feed, FeedComment, Like, FeedComment, CommentLike
from django.contrib.auth.models import User
from django.shortcuts import redirect 
from django.http import JsonResponse, HttpResponse
import json

def index(request):
    if request.method == 'GET': # index
        feeds = Feed.objects.all()
        return render(request, 'feedpage/index.html', {'feeds': feeds})
    elif request.method == 'POST': # create(form을 이용하여 submit한 형태) 
        title = request.POST['title']
        content = request.POST['content']
        Feed.objects.create(title=title, content=content, author=request.user)        
        return redirect('/feeds') 

def new(request):
    return render(request, 'feedpage/new.html')

def show(request,id):
    feed=Feed.objects.get(id=id)
    return render(request,'feedpage/show.html',{'feed':feed})

def delete(request, id):
    feed = Feed.objects.get(id=id)
    feed.delete()
    return redirect('/feeds')

def edit(request, id):
    if request.method == 'GET':
        feed = Feed.objects.get(id=id)
        return render(request, 'feedpage/edit.html', {'feed': feed})
    elif request.method == 'POST':
        feed = Feed.objects.get(id=id)
        feed.title=request.POST['title']
        feed.content=request.POST['content']
        feed.save()
        feed.update_date()
        return redirect('/feeds/'+str(id)) 

def create_comment(request, id):
    content = request.POST['content']
    new_comment = FeedComment.objects.create(feed_id=id, content=content, author=request.user)

    context = {
        'id': new_comment.id,
        'username': new_comment.author.username,
        'content': new_comment.content,
        # 'liked_users': new_comment.liked_users.count
    }

    return JsonResponse(context)
    # return HttpResponse(json.dumps(context), content_type="application/json")
    # return redirect('/feeds')

def delete_comment(request, id, cid):
    c = FeedComment.objects.get(id=cid)
    c.delete()
    return redirect('/feeds')

def feed_like(request, pk):
    feed = Feed.objects.get(id=pk)
    like_list = feed.like_set.filter(user_id=request.user.id)
    if like_list.count() > 0:
        feed.like_set.get(user_id=request.user.id).delete()
    else:
        Like.objects.create(user_id=request.user.id, feed_id=feed.id)
    return redirect('/feeds')

def comment_like(request, id, cid):
    feed = Feed.objects.get(id=id) # in fact, no use
    comment = FeedComment.objects.get(id=cid)
    # get을 쓰면 No match 에러가 발생하는 이유: 좋아요가 없을 수도 있으니까! 
    commentlike_list = comment.commentlike_set.filter(user_id=request.user.id) 
    if commentlike_list.count() > 0:
        comment.commentlike_set.get(user_id=request.user.id).delete()
    else:
        CommentLike.objects.create(user_id=request.user.id, comment_id=comment.id)
    FeedComment.objects.filter(feed_id=id).all = FeedComment.objects.filter(feed_id=id).order_by('-liked_users')
    return redirect('/feeds')