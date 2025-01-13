/***************************************************
 ====================  JS INDEX ====================== 
****************************************************
01. Mobile menu Start
02. Mobile offcanvas
****************************************************/

(function ($) {
    "use strict";  
    // Using an object literal for a jQuery Hello Animation Theme module
    var edd_envatu_module = {
    
      init: function (settings) {
        edd_envatu_module.config = {       
          envatu_api_input : null,
        };
          // Allow overriding the default config
        $.extend(edd_envatu_module.config, settings);
        edd_envatu_module.setup();
      },
   
      setup: function(){
      
        $('.edd-settings-content table input').each(function(){   
           
           if($(this).attr('id') == 'edd_settings[wcf_edd_envatu_api]'){
                edd_envatu_module.config.envatu_api_input =  $(this);
           }            
        });       
       
        if(edd_envatu_module.config.envatu_api_input && edd_envatu_module.config.envatu_api_input.val().length > 6){
           
            jQuery.ajax({
                type : "post",
                dataType : "json",
                url : wcf_envatu.ajax_url,
                data : {action: "wcf_envatu_api_validation", token : edd_envatu_module.config.envatu_api_input.val(), security: wcf_envatu.nonce},
                success: function(response) {
                    
                    if(response.success){
                        if(response.data.code == 200){
                            edd_envatu_module.config.envatu_api_input.after('<span class="wcf-valid-token wcf-e-valid"> &#10003; '+response.data.msg+'</span>');
                        }else{
                            edd_envatu_module.config.envatu_api_input.after('<span class="wcf-valid-token error"> &#10540; '+response.data.msg+'</span>');
                        }                        
                    }                  
                   
                }
             }); 
        }
       
      }
    };
    $(document).ready(edd_envatu_module.init);
  
  })(jQuery);
  
  
  
  
  
  
  