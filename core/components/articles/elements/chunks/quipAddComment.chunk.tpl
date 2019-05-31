[[+preview]]
[[+successMsg]]

<form id="quip-add-comment-[[+idprefix]]" action="[[+url]]#quip-comment-preview-box-[[+idprefix]]" method="post">
	
    <input type="hidden" name="nospam" value="" />
    <input type="hidden" name="thread" value="[[+thread]]" />
    <input type="hidden" name="parent" value="[[+parent]]" />
    <input type="hidden" name="auth_nonce" value="[[+auth_nonce]]" />
    <input type="hidden" name="preview_mode" value="[[+preview_mode]]" />	

  <div class="form-group row">
    <label for="staticEmail" class="col-sm-2 col-form-label">Your name</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" name="name" id="quip-comment-name-[[+idprefix]]" value="[[+name]]" placeholder="Name" />
    </div>
  </div>
	
  <div class="form-group row">
    <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" name="email" id="quip-comment-email-[[+idprefix]]" value="[[+email]]" placeholder="Email" />
    </div>
  </div>
  
    <div class="form-group row">
    <label for="staticEmail" class="col-sm-2 col-form-label">Website</label>
    <div class="col-sm-10">
      <input type="url" class="form-control" name="website" id="quip-comment-website-[[+idprefix]]" value="[[+website]]" placeholder="Website" />
    </div>
  </div>
  
  <div class="form-group row">
    <input class="form-check-input" type="checkbox" checked="checked" value="1" name="notify" id="quip-comment-notify-[[+idprefix]]" [[+notify:if=`[[+notify]]`:eq=`1`:then=`checked="checked"`]] />
    <label class="form-check-label" for="quip-comment-notify-[[+idprefix]]">Check me out:<span class="quip-error">[[+error.notify]]</span>
  </div>
  
      <div class="quip-fld recaptcha">
    [[+quip.recaptcha_html]]
    <span class="quip-error">[[+error.recaptcha]]</span>
    </div>
  
   <div class="form-group row">
    <label for="exampleFormControlTextarea1">Message</label>
    <textarea class="form-control" name="comment" id="quip-comment-box-[[+idprefix]]" rows="5" placeholder="Comment...">[[+comment]]</textarea>
  </div>
  

  

    <button type="submit" class="btn btn-primary" name="[[+preview_action]]" value="1">[[%quip.preview]]</button>
    [[+can_post:is=`1`:then=`<button type="submit" class="btn btn-secondary" name="[[+post_action]]" value="1">[[%quip.post]]</button>`]]

  
</form>
