(function ($) {
    "use strict";


    var Wcf_User_Guilder = {
        init: function (settings) {

            Wcf_User_Guilder.config = {
                footer_link: {
                    documentation_link: 'https://support.crowdytheme.com/',
                    support_link: 'https://crowdyflow.ticksy.com/',
                    feature_link: 'https://support.crowdytheme.com/roadmap/',
                },
                rating_link: 'https://themeforest.net/user/wealcoder_agency',
                update_link: ajax_object.update_path,
                banner_link: 'https://crowdytheme.com/assets/wp-content/uploads/2024/07/theme-preview.png',
                location: '#wcf-user-guider-dashboard',
                close: ".wcf-info-ug-close",
                modal: ".wcf-info-ug-modal",
                container_id: 'info-user-guide',                           // wcf-user-guider-dashboard
                container_class: 'info-user-guide',                           // info-user-guide
                dynamic_container: 'info-user-dynamic-container',
                check_html: '<span>&#10003;</span>',
                cross_html: '<span>&#10540;</span>',
                container_html: '',
                current_step: 'license_check',
                ls_code: '',
                ls_email: '',
                current_g_activitiy: false,
                user_submitted: false,
                license_active: false,
                has_update: false,
                welcome_heading: 'Welcome to Helo 1.0.3',
                welcome_desc: 'Helo is a versatile, multi-purpose WordPress theme designed to serve agencies, personal portfolios, business consultancies, organizations, and more. It\'s packed with advanced features, a responsive design, and massive templates and widgets to offer unparalleled performance.',
                _required_plugins: [
                    {
                        'slug': 'helo-essential', 'title': 'Essential Plugin', 'remote-source': false
                    },
                    {
                        'slug': 'animation-addons-for-elementor', 'title': 'Animation Addons', 'remote-source': false
                    },
                    {
                        'slug': 'wcf-addons-pro', 'title': 'WCF Addons Pro', 'remote-source': false
                    },
                    {
                        'slug': 'contact-form-7', 'title': 'Contact form 7', 'remote-source': true
                    },
                    {
                        'slug': 'elementor', 'title': 'Elementor', 'remote-source': true
                    },
                ],
                loader_icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="#CEFF39" stroke="#CEFF39" stroke-width="11" width="30" height="30" x="25" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.5" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></rect><rect fill="#CEFF39" stroke="#CEFF39" stroke-width="11" width="30" height="30" x="85" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.5" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></rect><rect fill="#CEFF39" stroke="#CEFF39" stroke-width="11" width="30" height="30" x="145" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.5" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></rect></svg>'
            };

            // Allow overriding the default config
            $.extend(Wcf_User_Guilder.config, settings);
            Wcf_User_Guilder.setup();
        },

        setup: function () {
            // setup event listner           
            Wcf_User_Guilder.check_license_activation();
            Wcf_User_Guilder.createContainer();
            Wcf_User_Guilder.register_event_listners();
            Wcf_User_Guilder.theme_update_status_check();
            setTimeout(function () {
                sessionStorage.removeItem('wcf_theme_update_checker');
                Wcf_User_Guilder.theme_update_status_check();
            }, 10000);
        },

        createContainer: function () {
            const $footer_content = `
            <style> 
            .wcf-warning-message {
                text-transform: capitalize;
                font-size: 18px;
                font-style: italic;
            }
            .wcf-info-ug-modal {
                overflow: auto; 
                position: relative;
                background: #1C1D20;
                z-index: 0;
                font-family: 'euclid_Circular_B';
            }
            .wcf-info-ug-modal ul,
            .wcf-info-ug-modal ul li,
            .wcf-info-ug-modal h3,
            .wcf-info-ug-modal p {
                margin: 0;
                color: #fff;
            }
            .wcf-info-ug-modal p {
                font-size: 18px;
                color: #999;
            }
            .wcf--license-default-btn {
                padding: 15px 30px;
                background: #40CF79;
                border: none;
                border-radius: 5px;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
            }

            .wcf-info-ug-modal .list li {
                font-size: 18px;
                color: #999999;
                padding-bottom: 10px;
                padding-left: 15px;
                position: relative;
                line-height: 1;
            }
            
            .wcf-info-ug-modal .list li:last-child {
                padding-bottom: 0;
            }

            .wcf-info-ug-modal .list li::before {
                position: absolute;
                content: "";
                width: 5px;
                height: 5px;
                background: #fff;
                top: 8px;
                left: 0;
                border-radius: 100px;
            }

            .wcf--license-default-btn:hover {
                color: #1C1D20;
                background: #fff;
            }

            .wcf-info-ug-modal-content {
                margin: 0 auto;
                padding: 60px 15px 90px;
                max-width: 1290px;
            }

            .wcf-into-area-header {
                padding-bottom: 45px;
            }

            .welcome-message h3 {
                font-size: 40px;
                font-weight: 500;
                line-height: 1;
                color: #fff;
                padding-bottom: 30px;
            }

            .welcome-message p {
                line-height: 1.5;
                font-weight: 400;
                padding-bottom: 20px;
            }

            .wcf-guide-section {
                display: grid;
                grid-template-columns: 1fr 1.4fr;
                gap: 30px;
            }

            .wcf-theme-update {
                border-radius: 5px;
                position: relative;
            }

            .wcf-theme-update .update {
                position: absolute;
                top: 40px;
                left: 40px;
            }

            .wcf-steps-guide {
                padding: 40px;
                border-radius: 5px;
                background: #232426;
                border: 1px solid #303133;
            }

            .wcf-theme-update img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 5px;
            }

            .wcf-theme-update h3 {
                font-size: 30px;
                color: #fff;
                font-weight: 500;
                padding-bottom: 30px;
            }

            .wcf-theme-update p {
                color: #303133;
                padding-bottom: 40px;
                max-width: 400px;
            }

            .wcf-theme-update a {
                display: inline-block;
                padding: 16px 24px;
                background: #fff;
                color: #1C1D20;
                font-size: 16px;
                font-weight: 600;
                text-decoration: none;
                text-transform: capitalize;
                border-radius: 5px;
                transition: all 0.3s;
            }

            .wcf-theme-update a:hover {
                color: #fff; 
                background: #1C1D20;
            }

            .info-user-dynamic-container h3 {
                color: #fff;
                font-size: 30px;
                font-weight: 500;
            }

            .wcf-license-step-one h3 {
                padding-bottom: 30px;
            }

            .wcf-license-step-one p {
                padding-bottom: 40px;
            }

            .wcf-license-step-one .el-license-field {
                gap: 10px;
                display: grid;
                align-items: center;
                grid-template-columns: 1fr 3.5fr;
                margin-bottom: 12px;
            }

            .wcf-license-step-one .el-license-field label {
                font-size: 18px;
                color: #fff;
                font-weight: 500;
            }

            .wcf-license-step-one .el-license-field p {
                font-size: 14px;
                padding-top: 5px;
                padding-bottom: 35px;
            }

            .wcf-license-step-one input.code {
                background: #1C1D20;
                padding: 5px 20px 7px;
                color: #4D4E50;
                font-size: 18px;
                border: none;
                width: 100%;
                outline: none;
                border-radius: 5px;
            }

            .wcf-license-step-one input:focus {
                outline: none;
                border: none;
                box-shadow: none;
            }

            .el-license-active-btn {
                margin-bottom: 50px;
            }

            .wcf--license-activation-button {
                padding: 15px 25px;
                background: #40CF79;
                border: none;
                border-radius: 5px;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s;
                cursor: pointer;
            }

            .wcf--license-activation-button:hover {
                color: #1C1D20;
                background: #fff;
            }

            .wcf-flex-area {
                gap: 30px;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                margin-top: 30px;
            }

            .wcf-flex-area .wcf-info--card {
                background: #232426;
                padding: 50px;
                border-radius: 10px;
                border: 1px solid #303133;
                text-align: center;
            }

            .wcf-flex-area .wcf-info--card svg {
                width: 1em;
                height: 1em;
            }

            .wcf-flex-area .wcf-info--card .icon {
                width: 85px;
                height: 85px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #2A2B2D;
                border-radius: 15px;
                font-size: 36px;
                margin: 0 auto;
                margin-bottom: 50px;
                color: #40CF79;
                fill: #40CF79;
            }

            .wcf-flex-area .wcf-info--card h3 {
                color: #fff;
                padding-bottom: 25px;
                font-size: 30px;
                font-weight: 500;
            }

            .wcf-flex-area .wcf-info--card p {
                padding-bottom: 40px;
            }

            .wcf-license-step-two .theme-activated {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                background: #3A3B3E;
                padding: 7px 10px;
                border-radius: 7px;
                color: #fff;
                fill: #fff;
                text-transform: uppercase;
                margin-bottom: 28px;
                font-size: 13px;
                font-weight: 500;
            }

            .wcf-license-step-two h3 {
                padding-bottom: 45px;
            }

            .wcf-license-step-two .list {
                margin-bottom: 45px;
            }

            .wcf-license-step-two .list li {
                color: #fff;
                padding-left: 0;
                padding-bottom: 15px;
                display: grid;
                align-items: center;
                gap: 150px;
                grid-template-columns: 0.4fr 1fr;
            }

            .wcf-license-step-two .list li::before {
                display: none;
            }

            .wcf-license-step-two .wcf--install-btn-wrap {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .wcf-license-step-two .wcf--license-default-btn.deactivate {
                background: #3A3B3E;
            }
            
            .wcf-license-step-two .wcf--license-default-btn.deactivate:hover {
                background: #fff;
            }

            .wcf-license-step-two .wcf--plugins-install-button {
                gap: 10px;
                display: flex;
                align-items: center;
            }
            
            .wcf-license-step-two .wcf--plugins-install-button svg {
                width: 1em;
                height: 1em;
                font-size: 18px;
                margin-top: 3px;
            }

            .wcf--license-step-three {
                text-align: center;
            }

            .wcf--license-step-three h3 {
                padding-bottom: 30px;
            }

            .wcf--license-step-three h3 svg {
                fill: #FFA755;
            }

            .wcf--license-step-three>p {
                max-width: 560px;
                margin: 0 auto;
                margin-bottom: 40px;
            }
            
            .wcf--license-step-three .rating-wrap {
                margin-top: 60px;
                border: 1px dashed #565759;
                padding: 35px;
                background: #2C2D2F;
                border-radius: 12px;
            }

            .wcf--license-step-three .rating-wrap p {
                max-width: 400px;
                margin: 0 auto;
                margin-bottom: 50px;
            }
            
            .wcf--license-step-three .rating-wrap p {
                color: #fff;
            }
            
            .wcf--license-step-three .rating {
                background: #7165FF;
            }
            
            .wcf--license-step-three .rating:hover {
                background: #fff;
            }

            .wcf-user-guider-dashboard  .wcf-info-ug-close{
                display:none;
            }
             
             
             /*  Laptop  */
            @media (max-width: 1400px) {
                .wcf-license-step-two .list li {
                    grid-template-columns: 1fr 1fr;
                }

            }
             
            /*  Large Tablet  */
            @media (max-width: 1365px) {
                .wcf-guide-section {
                        gap: 15px;
                }
                .info-user-dynamic-container h3 {
                    font-size: 24px;
                }
                .wcf-license-step-one h3 {
                    padding-bottom: 20px;
                }
                .wcf-license-step-one .el-license-field label {
                    font-size: 16px;
                }
                .wcf-steps-guide {
                    padding: 30px 20px;
                }
                .wcf-license-step-one .el-license-field {
                    grid-template-columns: 1fr 3fr;
                }
                .el-license-active-btn {
                    margin-bottom: 30px;
                }
                .wcf-info-ug-modal p,
                .wcf-info-ug-modal .list li {
                    font-size: 16px;
                }
                .wcf-flex-area .wcf-info--card {
                    padding: 30px 15px;
                }
                .wcf-flex-area {
                    gap: 10px;
                    margin-top: 20px;
                }
                .wcf-flex-area .wcf-info--card h3 {
                    padding-bottom: 15px;
                    font-size: 24px;
                }
                .wcf-flex-area .wcf-info--card .icon {
                    margin-bottom: 30px;
                }
                .wcf-into-area-header {
                    padding-bottom: 30px;
                }
                .wcf-license-step-two .list li {
                    gap: 50px;
                }
                
            
            }
            
            #wcf-theme-update-info ul{
                display: flex;
                flex-direction: column;
                gap: 7px;
                font-size: 15px;
                text-decoration: solid;
                color: #fff;              
                max-width: 400px;
            }
            
            
            /*  Tablet  */
            @media (max-width: 1023px) {
                .wcf-license-step-two .list li {
                    grid-template-columns: 1fr auto;
                }
                .wcf-license-step-two .wcf--license-default-btn.deactivate,
                .wcf-license-step-two .wcf--plugins-install-button {
                    padding: 15px 18px;
                }
                .wcf-license-step-two .wcf--install-btn-wrap {
                    gap: 10px;
                }
                .wcf--license-step-three>p {
                    margin-bottom: 25px;
                }
                .wcf--license-step-three .rating-wrap {
                    margin-top: 50px;
                }
            }
            
            
            /*  Mobile  */
            @media (max-width: 767px) {
                .wcf-guide-section {
                    grid-template-columns: 1fr;
                }
                .wcf-license-step-one .el-license-field {
                    grid-template-columns: 1fr;
                }
                .wcf-flex-area {
                    grid-template-columns: 1fr;
                }
                .wcf-info-ug-modal-content {
                    padding: 40px 15px 60px;
                }
                .welcome-message h3 {
                    font-size: 28px;
                    padding-bottom: 20px;
                }
                .wcf-license-step-two .wcf--install-btn-wrap {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .wcf--license-step-three h3 svg {
                    font-size: 20px;
                    width: 1em;
                }
                .wcf--license-step-three .rating-wrap {
                    padding: 25px 15px;
                }
                
            }
            
        </style>
            <div id="mywcf-info-ug-modal" class="wcf-info-ug-modal">
                <!-- wcf-info-ug-modal content -->
                <div class="wcf-info-ug-modal-content">
                  <span class="wcf-info-ug-close">&times;</span>
                    <div class="wcf-into-area-header">
                        <div class="welcome-message">
                            <h3>${Wcf_User_Guilder.config.welcome_heading}</h3> 
                            <p>${Wcf_User_Guilder.config.welcome_desc}</p>
                        </div>
                    </div>
                    <div class="wcf-guide-section">
                        <div class="wcf-theme-update">
                            <img src="${Wcf_User_Guilder.config.banner_link}"/> 
                            <div id="wcf-theme-update-info" class="update">                               
                            </div>
                        </div>
                        <div class="wcf-steps-guide">                             
                            <div class="${Wcf_User_Guilder.config.dynamic_container}">
                                <h3>Install Required Plugins</h3>
                                <ul class="list">                                   
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="wcf-flex-area">
                        <div class="wcf-info--card">
                            <div class="icon">
                            <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0782 18.8672V23.7891C16.0782 24.0067 16.1647 24.2153 16.3185 24.3692L17.9591 26.0098C18.113 26.1636 18.3216 26.25 18.5391 26.25H23.461C23.6786 26.25 23.8873 26.1636 24.0411 26.0098L25.6816 24.3692C25.8354 24.2153 25.9219 24.0067 25.9219 23.7891V18.8672C25.9219 17.6115 26.0055 17.3415 28.1798 14.4894C29.3859 12.9075 30.0234 11.0174 30.0234 9.02343C30.0234 4.04791 25.9755 0 21 0C16.0246 0 11.9767 4.04791 11.9767 9.02343C11.9767 11.0174 12.6141 12.9074 13.8203 14.4894C15.9945 17.3413 16.0782 17.6114 16.0782 18.8672ZM24.2813 19.6876V21.3282H17.7188V19.6876H24.2813ZM18.8789 24.6094L17.7187 23.4493V22.9688H24.2812V23.4493L23.1212 24.6094H18.8789ZM21 1.64062C25.0709 1.64062 28.3828 4.95255 28.3828 9.02343C28.3828 10.6549 27.8615 12.2011 26.8752 13.4947C25.0352 15.9081 24.459 16.7658 24.3193 18.0469H21.8203V11.0039L23.2207 9.60347C23.541 9.28314 23.541 8.76372 23.2207 8.4433C22.9003 8.12305 22.3809 8.12305 22.0605 8.4433L21 9.50397L19.9395 8.44339C19.6194 8.12305 19.0999 8.12297 18.7794 8.4433C18.4589 8.76363 18.459 9.28297 18.7793 9.60339L20.1796 11.0038V18.0469H17.6806C17.5409 16.7656 16.9648 15.9081 15.1248 13.4948C14.1385 12.2011 13.6171 10.6549 13.6171 9.02343C13.6173 4.95255 16.9292 1.64062 21 1.64062ZM7.06921 9.84372H9.10563C9.55861 9.84372 9.92594 9.47638 9.92594 9.0234C9.92594 8.57042 9.55861 8.20308 9.10563 8.20308H7.06921C6.61623 8.20308 6.2489 8.57042 6.2489 9.0234C6.2489 9.47638 6.61615 9.84372 7.06921 9.84372ZM10.2891 3.78656L8.5254 2.76838C8.13305 2.54189 7.9986 2.04019 8.22517 1.64783C8.45166 1.25555 8.95328 1.12102 9.34572 1.34759L11.1094 2.36577C11.5017 2.59226 11.6362 3.09397 11.4096 3.48632C11.2577 3.74948 10.9819 3.89665 10.6984 3.89665C10.5593 3.89665 10.4183 3.86113 10.2891 3.78656ZM10.2891 14.2602L8.5254 15.2785C8.13305 15.505 7.9986 16.0067 8.22517 16.399C8.37717 16.6622 8.6528 16.8093 8.93638 16.8093C9.07551 16.8093 9.2166 16.7738 9.34572 16.6993L11.1094 15.681C11.5017 15.4544 11.6362 14.9528 11.4096 14.5604C11.1831 14.1682 10.6813 14.0337 10.2891 14.2602ZM32.8946 9.84372C32.4416 9.84372 32.0743 9.47638 32.0743 9.0234C32.0743 8.57034 32.4415 8.20308 32.8946 8.20308H34.931C35.384 8.20308 35.7513 8.57042 35.7513 9.0234C35.7513 9.47638 35.384 9.84372 34.931 9.84372H32.8946ZM31.3018 3.89665C31.4409 3.89665 31.5819 3.86113 31.7111 3.78656L33.4748 2.76838C33.8671 2.54189 34.0016 2.04019 33.775 1.64783C33.5486 1.25555 33.0471 1.12102 32.6545 1.34759L30.8908 2.36577C30.4984 2.59226 30.364 3.09397 30.5906 3.48632C30.7425 3.74948 31.0182 3.89665 31.3018 3.89665ZM32.6545 16.6994L30.8908 15.6811C30.4984 15.4545 30.364 14.9529 30.5906 14.5605C30.817 14.1683 31.3187 14.0337 31.7111 14.2603L33.4748 15.2786C33.8671 15.5051 34.0016 16.0068 33.775 16.3991C33.6231 16.6623 33.3473 16.8094 33.0638 16.8094C32.9247 16.8094 32.7837 16.7739 32.6545 16.6994ZM41.4377 37.2242C40.9811 37.0728 40.5181 36.9165 40.0498 36.7583L39.867 36.6967V33.4205C39.867 33.0492 39.6176 32.7242 39.259 32.6282C38.4004 32.3981 37.5079 32.1256 36.5633 31.8372L36.5619 31.8368C33.9988 31.0543 31.094 30.1675 28.3329 30.0355C25.3551 29.8926 22.9479 30.6358 21 32.3032C19.0521 30.6359 16.6445 29.8927 13.6671 30.0355C10.9056 30.1675 8.00017 31.0546 5.4368 31.8371C4.49197 32.1256 3.59956 32.3981 2.74095 32.6282C2.38231 32.7242 2.13294 33.0492 2.13294 33.4205V36.6967L1.94656 36.7597C1.47956 36.9173 1.01773 37.0732 0.562297 37.2242C0.150175 37.3609 -0.084104 37.7951 0.0279498 38.2146L0.876884 41.3915C0.933157 41.6017 1.07048 41.781 1.25898 41.8899C1.38482 41.9626 1.52657 42 1.66938 42C1.74042 42 1.81187 41.9908 1.88168 41.972C2.78303 41.7305 3.73368 41.4364 4.74011 41.125C7.24106 40.3512 10.0756 39.4743 12.6791 39.2912C15.5293 39.0908 17.6801 39.7593 19.256 41.3354C19.4099 41.4892 19.6185 41.5756 19.836 41.5756H22.164C22.3815 41.5756 22.5901 41.4892 22.744 41.3354C24.32 39.7594 26.4708 39.0902 29.321 39.2912C31.9242 39.4743 34.7584 40.3511 37.2591 41.1248L37.26 41.125C38.2664 41.4364 39.217 41.7305 40.1184 41.972C40.3286 42.0284 40.5526 41.9988 40.7411 41.8899C40.9296 41.781 41.0671 41.6016 41.1232 41.3914L41.972 38.2146C42.0841 37.7951 41.8499 37.3609 41.4377 37.2242ZM36.0843 33.4063C36.8249 33.6325 37.5339 33.8489 38.2265 34.0451V36.1482C35.625 35.2933 32.9612 34.5168 30.2704 34.2552C26.9902 33.9363 24.2093 34.4619 21.8203 35.8603V33.7702V33.7698C25.6609 30.2242 31.1921 31.9128 36.0841 33.4062L36.0843 33.4063ZM39.7525 40.1662C39.113 39.9809 38.443 39.7736 37.7457 39.5579L37.7449 39.5577C32.5581 37.953 26.1266 35.9634 21.8337 39.9349H20.1664C15.8736 35.9634 9.44227 37.9529 4.25523 39.5577C3.55764 39.7735 2.88729 39.9809 2.2477 40.1662L1.81211 38.5363C2.02547 38.4645 2.24008 38.3921 2.45587 38.3193L2.45789 38.3186L2.47131 38.3141L2.47604 38.3125L2.47632 38.3124C4.13433 37.7526 5.84869 37.1739 7.57509 36.7132C8.0128 36.5964 8.273 36.1469 8.15619 35.7092C8.0393 35.2714 7.58952 35.0112 7.15214 35.1281C6.00863 35.4332 4.88071 35.7851 3.77355 36.1485V34.045C4.46621 33.8487 5.1752 33.6323 5.91585 33.4062C10.8079 31.9127 16.3392 30.2242 20.1797 33.7696V33.77V35.8588C18.5529 34.9044 16.7562 34.3621 14.7286 34.2089C14.2755 34.1749 13.8828 34.5133 13.8487 34.9651C13.8146 35.4169 14.1531 35.8108 14.6049 35.8449C16.8679 36.016 18.7958 36.7378 20.4989 38.0518C20.7941 38.2796 21.2059 38.2796 21.5011 38.0518C26.7527 34.0002 33.5382 36.2913 39.5249 38.3127L39.525 38.3128C39.7472 38.3878 39.9682 38.4624 40.1879 38.5363L39.7525 40.1662ZM10.978 34.3489H10.9787C11.4317 34.3489 11.799 34.7162 11.799 35.1692C11.799 35.6222 11.4318 35.9895 10.9787 35.9895C10.5256 35.9895 10.1581 35.6222 10.1581 35.1692C10.1581 34.7162 10.5251 34.3489 10.978 34.3489Z"/>
                            </svg>
                            
                            </div>
                            <h3>Knowledge base</h3>
                            <p>Cut your learning curve and get started with Vault in no time! Read our well-structured docs.</p>
                            <a href="${Wcf_User_Guilder.config.footer_link.documentation_link}" class="wcf--license-default-btn">Learn more</a>
                        </div>
                        <div class="wcf-info--card">
                            <div class="icon">
                            <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8203 0.820312C21.8203 1.27341 21.4531 1.64062 21 1.64062C20.5469 1.64062 20.1797 1.27341 20.1797 0.820312C20.1797 0.367218 20.5469 0 21 0C21.4531 0 21.8203 0.367218 21.8203 0.820312ZM38.7188 9.84375H39.5391C40.896 9.84375 42 10.9477 42 12.3047V37.0781C42 38.4351 40.896 39.5391 39.5391 39.5391H26.7422C26.7422 40.896 25.6382 42 24.2812 42H17.7188C16.3618 42 15.2578 40.896 15.2578 39.5391H2.46094C1.10396 39.5391 0 38.4351 0 37.0781V12.3047C0 10.9477 1.10396 9.84375 2.46094 9.84375H3.28125V8.20312C3.28125 7.75003 3.6486 7.38281 4.10156 7.38281H10.8453C11.811 4.39546 14.0984 1.94312 17.068 0.75097C17.4885 0.582037 17.9661 0.78609 18.1349 1.20663C18.3036 1.62704 18.0997 2.10461 17.6793 2.27355C14.6305 3.49748 12.5495 6.22271 12.0876 9.22685C11.508 12.9913 13.2591 16.6313 16.5489 18.5002C17.5235 19.0539 18.1289 20.1253 18.1289 21.2961V22.1484H20.1797V13.4649L17.9589 11.2442C17.6386 10.9237 17.6386 10.4044 17.9589 10.0841C18.2794 9.76364 18.7987 9.76364 19.119 10.0841L21 11.9649L22.8808 10.0841C23.2013 9.76364 23.7206 9.76364 24.0409 10.0841C24.3614 10.4044 24.3614 10.9239 24.0409 11.2442L21.8203 13.4649V22.1484H23.8711V21.2977C23.8711 20.1243 24.4727 19.0546 25.4415 18.5061C28.2676 16.905 30.0234 13.8999 30.0234 10.6641C30.0234 6.84935 27.6561 3.59361 24.3244 2.27239C23.9034 2.10538 23.6973 1.6287 23.8643 1.20753C24.0313 0.786346 24.508 0.580243 24.9292 0.747253C27.8904 1.92158 30.1767 4.37483 31.1493 7.38281H37.8984C38.3514 7.38281 38.7188 7.75003 38.7188 8.20312V9.84375ZM26.25 19.9337C25.7946 20.1916 25.5117 20.7142 25.5117 21.2977V25.4297C25.5117 27.239 24.0398 28.7109 22.2305 28.7109H21.8203V35.0586C22.3033 34.7784 22.8636 34.6173 23.4609 34.6173H37.0781V9.02357H31.5379C31.6214 9.56433 31.6641 10.1129 31.6641 10.6642C31.6641 14.4898 29.5894 18.0416 26.25 19.9337ZM23.8711 25.4297V23.7891H18.1289V25.4297C18.1289 26.3343 18.8649 27.0703 19.7695 27.0703H22.2305C23.1351 27.0703 23.8711 26.3343 23.8711 25.4297ZM10.4598 9.02267H4.92188V34.6172H18.5391C19.1364 34.6172 19.6967 34.7784 20.1797 35.0585V28.7109H19.7695C17.9602 28.7109 16.4883 27.239 16.4883 25.4297V21.2961C16.4883 20.7142 16.2009 20.1894 15.7385 19.9267C11.8649 17.7261 9.79709 13.4503 10.4598 9.02267ZM15.2578 37.8984C16.1625 37.8984 16.8984 38.6344 16.8984 39.5391C16.8984 39.9914 17.2664 40.3594 17.7188 40.3594H20.1797V37.8984C20.1797 36.9938 19.4437 36.2578 18.5391 36.2578H4.10156C3.6486 36.2578 3.28125 35.8906 3.28125 35.4375V11.4844H2.46094C2.00861 11.4844 1.64062 11.8524 1.64062 12.3047V37.0781C1.64062 37.5305 2.00861 37.8984 2.46094 37.8984H15.2578ZM39.5391 37.8984C39.9914 37.8984 40.3594 37.5305 40.3594 37.0781V12.3047C40.3594 11.8524 39.9914 11.4844 39.5391 11.4844H38.7188V35.4375C38.7188 35.8906 38.3514 36.2578 37.8984 36.2578H23.4609C22.5563 36.2578 21.8203 36.9938 21.8203 37.8984V40.3594H24.2812C24.7336 40.3594 25.1016 39.9914 25.1016 39.5391C25.1016 38.6344 25.8375 37.8984 26.7422 37.8984H39.5391Z"/>
                                </svg>
                            </div>

                            <h3>Need Help?</h3>
                            <p>We've got your back. Looking forward to helping you design a website you can be proud of.</p>
                            <a href="${Wcf_User_Guilder.config.footer_link.support_link}" class="wcf--license-default-btn">Get support</a>
                        </div>
                        <div class="wcf-info--card">
                            <div class="icon">
                            <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M27.3563 0.0793763L41.5001 6.07472C41.5998 6.10397 41.6918 6.15509 41.7691 6.22434C41.8464 6.29359 41.9072 6.37921 41.947 6.47491C41.9868 6.57061 42.0046 6.67397 41.999 6.7774C41.9935 6.88083 41.9647 6.98172 41.9149 7.07265L36.1619 20.5135C36.0808 20.7036 35.9273 20.8539 35.735 20.9314C35.5428 21.0088 35.3275 21.0071 35.1365 20.9267L30.8785 19.1179C30.7454 19.0844 30.6247 19.0137 30.5306 18.9141C30.4365 18.8145 30.373 18.6901 30.3475 18.5558C30.322 18.4214 30.3356 18.2825 30.3867 18.1556C30.4378 18.0287 30.5242 17.9189 30.6359 17.8393C30.9758 17.5115 31.2289 17.1048 31.3725 16.6558C31.5162 16.2067 31.5459 15.7292 31.4591 15.2659C31.3723 14.8026 31.1716 14.3679 30.875 14.0007C30.5783 13.6335 30.195 13.3452 29.7592 13.1615C29.4127 13.0149 29.04 12.9393 28.6634 12.9393C28.2869 12.9393 27.9142 13.0149 27.5676 13.1615C27.2163 13.3058 26.8971 13.5178 26.6285 13.7854C26.3598 14.053 26.1469 14.3709 26.0022 14.7208C25.8498 15.0728 25.7725 15.4524 25.7752 15.8357C25.7891 15.9689 25.7661 16.1034 25.7087 16.2246C25.6513 16.3457 25.5616 16.4489 25.4495 16.5228C25.3373 16.5967 25.2069 16.6387 25.0725 16.644C24.9382 16.6493 24.8049 16.6178 24.6872 16.5529L21.0084 14.9937C20.8175 14.9129 20.6666 14.76 20.5888 14.5685C20.511 14.377 20.5127 14.1626 20.5935 13.9724L21.752 11.2593C21.546 11.2043 21.3446 11.1339 21.1493 11.0488C20.3431 10.7057 19.6569 10.1326 19.1774 9.4016C18.6979 8.67062 18.4464 7.81455 18.4548 6.94139C18.4632 6.06823 18.731 5.21711 19.2245 4.49538C19.7179 3.77365 20.4149 3.21366 21.2275 2.88604C22.3152 2.43816 23.5369 2.43816 24.6246 2.88604C24.8186 2.96966 25.0069 3.06603 25.1881 3.1745L26.3309 0.484783C26.3662 0.387001 26.422 0.297817 26.4946 0.22315C26.5671 0.148483 26.6548 0.0900408 26.7518 0.0517013C26.8487 0.0133618 26.9528 -0.00399845 27.057 0.000772958C27.1612 0.00554437 27.2632 0.0323382 27.3563 0.0793763ZM32.4283 18.1044L35.0348 19.2115L40.1616 7.1818L27.458 1.79456L26.2213 4.69478C26.1755 4.81997 26.0981 4.93136 25.9967 5.01831C25.8954 5.10527 25.7733 5.16488 25.6422 5.19147C25.5111 5.21806 25.3753 5.21073 25.2479 5.17018C25.1204 5.12963 25.0055 5.05722 24.9142 4.95985C24.6531 4.6848 24.3354 4.46936 23.9827 4.32835C23.282 4.03875 22.4946 4.03781 21.7932 4.32574C21.0918 4.61367 20.5337 5.16696 20.2413 5.86422C20.0574 6.29852 19.9838 6.77127 20.0269 7.24065C20.07 7.71004 20.2286 8.16162 20.4886 8.55546C20.7486 8.9493 21.102 9.27327 21.5175 9.49873C21.9331 9.72419 22.3981 9.84419 22.8713 9.84813C23.0005 9.84823 23.1276 9.88019 23.2414 9.94114C23.3552 10.0021 23.452 10.0902 23.5233 10.1975C23.5946 10.3048 23.6382 10.428 23.65 10.5561C23.6619 10.6843 23.6418 10.8133 23.5914 10.9318L22.3312 13.8008L24.3428 14.6584C24.4002 14.4515 24.4708 14.2484 24.5541 14.0503C24.784 13.5205 25.1167 13.0411 25.5331 12.6398C25.9495 12.2384 26.4414 11.9229 26.9806 11.7114C27.7947 11.382 28.6888 11.3011 29.5491 11.4791C30.4095 11.6571 31.1973 12.086 31.8124 12.7111C32.4274 13.3362 32.8419 14.1295 33.0032 14.9899C33.1644 15.8503 33.0651 16.739 32.7179 17.5431C32.634 17.7364 32.5372 17.9239 32.4283 18.1044ZM29.5713 24.2868H33.211C33.4185 24.2868 33.6176 24.369 33.7644 24.5152C33.9112 24.6614 33.9937 24.8597 33.9937 25.0665V41.2204C33.9937 41.4271 33.9112 41.6254 33.7644 41.7717C33.6176 41.9179 33.4185 42 33.211 42H0.782723C0.575132 42 0.376043 41.9179 0.229254 41.7717C0.0824651 41.6254 0 41.4271 0 41.2204V9.10745C0 8.90068 0.0824651 8.70238 0.229254 8.55617C0.376043 8.40996 0.575132 8.32783 0.782723 8.32783H16.8286C17.0361 8.32783 17.2352 8.40996 17.382 8.55617C17.5288 8.70238 17.6113 8.90068 17.6113 9.10745V13.3876C17.6117 13.5173 17.5797 13.645 17.5181 13.7593C17.4565 13.8735 17.3672 13.9707 17.2584 14.0419C17.1496 14.1131 17.0247 14.1562 16.895 14.1672C16.7652 14.1782 16.6348 14.1567 16.5155 14.1049C16.0771 13.9215 15.6033 13.8373 15.1283 13.8586C14.6534 13.8799 14.1891 14.0061 13.769 14.2279C13.349 14.4498 12.9837 14.7619 12.6995 15.1416C12.4154 15.5213 12.2195 15.9591 12.126 16.4235C12.0325 16.8878 12.0438 17.367 12.159 17.8265C12.2743 18.286 12.4905 18.7142 12.7922 19.0802C13.0939 19.4462 13.4735 19.7409 13.9036 19.9429C14.3336 20.1449 14.8033 20.2493 15.2788 20.2484C15.7057 20.2438 16.1279 20.1592 16.5233 19.9989C16.6473 19.9461 16.7828 19.926 16.9168 19.9407C17.0508 19.9555 17.1788 20.0044 17.2882 20.0828C17.3977 20.1612 17.4849 20.2665 17.5415 20.3884C17.5981 20.5103 17.6221 20.6446 17.6113 20.7785V24.2868H20.1551C20.1119 24.0291 20.0883 23.7685 20.0847 23.5072C20.0847 22.2459 20.5877 21.0363 21.4831 20.1444C22.3785 19.2525 23.593 18.7515 24.8593 18.7515C26.1256 18.7515 27.34 19.2525 28.2355 20.1444C29.1309 21.0363 29.6339 22.2459 29.6339 23.5072C29.6341 23.7683 29.6131 24.0291 29.5713 24.2868ZM16.0458 12.3897V9.88708H1.56545V24.3102H5.10336C5.95653 24.3102 5.98783 24.9963 5.82346 25.3939C5.65815 25.7837 5.57298 26.2026 5.57299 26.6257C5.57299 27.4735 5.9111 28.2865 6.51293 28.886C7.11477 29.4854 7.93103 29.8222 8.78216 29.8222C9.63328 29.8222 10.4495 29.4854 11.0514 28.886C11.6532 28.2865 11.9913 27.4735 11.9913 26.6257C11.9907 26.1976 11.9056 25.7737 11.7409 25.3783C11.6703 25.2609 11.6349 25.1258 11.639 24.989C11.643 24.8521 11.6863 24.7193 11.7636 24.6062C11.841 24.4931 11.9492 24.4044 12.0756 24.3506C12.2019 24.2967 12.3411 24.28 12.4766 24.3024H16.0458V21.7686C15.787 21.8099 15.5253 21.8307 15.2631 21.831C13.9968 21.831 12.7824 21.33 11.8869 20.4381C10.9915 19.5462 10.4885 18.3366 10.4885 17.0753C10.4885 15.814 10.9915 14.6043 11.8869 13.7124C12.7824 12.8206 13.9968 12.3195 15.2631 12.3195C15.5255 12.3224 15.7872 12.3459 16.0458 12.3897ZM4.07799 25.8695H1.56545V40.4485H16.0458V36.7687C16.0458 36.1294 16.4059 35.7552 17.1338 36.0514C17.5252 36.2161 17.9457 36.3009 18.3705 36.3009C19.2216 36.3009 20.0379 35.9641 20.6397 35.3647C21.2416 34.7652 21.5797 33.9522 21.5797 33.1044C21.5797 32.2567 21.2416 31.4436 20.6397 30.8442C20.0379 30.2447 19.2216 29.908 18.3705 29.908C17.9427 29.9033 17.5187 29.9883 17.126 30.1574C17.0024 30.2085 16.8677 30.2271 16.7349 30.2115C16.602 30.196 16.4753 30.1467 16.367 30.0685C16.2587 29.9903 16.1723 29.8858 16.116 29.7649C16.0598 29.6439 16.0356 29.5107 16.0458 29.3778V25.8695H13.4942C13.5356 26.1273 13.5565 26.388 13.5568 26.6491C13.5568 27.9104 13.0537 29.12 12.1583 30.0119C11.2629 30.9038 10.0485 31.4048 8.78216 31.4048C7.51585 31.4048 6.30141 30.9038 5.406 30.0119C4.51058 29.12 4.00754 27.9104 4.00754 26.6491C4.01 26.3878 4.03355 26.1271 4.07799 25.8695ZM17.6113 37.7822V40.4407H32.4595V25.8383H28.6085C28.4761 25.8478 28.3434 25.8236 28.223 25.768C28.1025 25.7124 27.9982 25.6272 27.92 25.5203C27.8417 25.4135 27.792 25.2886 27.7755 25.1574C27.759 25.0262 27.7764 24.8929 27.8258 24.7702C28.0064 24.3343 28.0879 23.8639 28.0645 23.3929C28.041 22.9219 27.9133 22.4619 27.6903 22.0458C27.4674 21.6298 27.1547 21.2681 26.7749 20.9866C26.395 20.705 25.9573 20.5107 25.4932 20.4176C25.0291 20.3244 24.55 20.3347 24.0903 20.4477C23.6306 20.5607 23.2018 20.7736 22.8344 21.0711C22.4671 21.3687 22.1704 21.7435 21.9657 22.1687C21.7609 22.5939 21.6532 23.059 21.6501 23.5306C21.6534 23.9592 21.7412 24.383 21.9084 24.778C21.9588 24.8965 21.979 25.0256 21.9671 25.1537C21.9552 25.2818 21.9117 25.405 21.8404 25.5124C21.7691 25.6197 21.6722 25.7077 21.5585 25.7687C21.4447 25.8296 21.3175 25.8616 21.1883 25.8617H17.6113V28.4033C17.8701 28.3616 18.1318 28.3407 18.394 28.3409C19.021 28.3409 19.6419 28.4639 20.2212 28.7029C20.8004 28.9419 21.3268 29.2922 21.7702 29.7338C22.2135 30.1754 22.5652 30.6997 22.8052 31.2767C23.0451 31.8537 23.1686 32.4721 23.1686 33.0966C23.1686 33.7212 23.0451 34.3396 22.8052 34.9166C22.5652 35.4936 22.2135 36.0178 21.7702 36.4595C21.3268 36.9011 20.8004 37.2514 20.2212 37.4904C19.6419 37.7294 19.021 37.8524 18.394 37.8524C18.1316 37.8499 17.8699 37.8265 17.6113 37.7822Z"/>
                            </svg>
                            
                            </div>
                            <h3>Suggest a Feature</h3>
                            <p>We're always working to improve Vault, so we'd love to hear how we can do better.</p>
                            <a href="${Wcf_User_Guilder.config.footer_link.feature_link}" class="wcf--license-default-btn">Send Features</a>
                        </div>
                    </div>
                </div>          
          </div>        
        `;

            Wcf_User_Guilder.config.container_html = $footer_content;
            if (Wcf_User_Guilder.config.location != '') {
                $(Wcf_User_Guilder.config.location).append($('<div/>', {
                    id: Wcf_User_Guilder.config.container_id,
                    class: Wcf_User_Guilder.config.container_class,
                    html: Wcf_User_Guilder.config.container_html
                }));
            } else {
                $('body').append($('<div/>', {
                    id: Wcf_User_Guilder.config.container_id,
                    class: Wcf_User_Guilder.config.container_class,
                    html: Wcf_User_Guilder.config.container_html
                }));
            }

        },

        register_event_listners: function () {

            $(Wcf_User_Guilder.config.close).on('click', function () {
                $(Wcf_User_Guilder.config.modal).hide();
            });
            // License form
            $(document).on('click', '.wcf--license-activation-button', function () {

                let ls_code = $('.wcf-steps-guide input[name="el_license_key"]');
                let ls_email = $('.wcf-steps-guide input[name="el_license_email"]');

                if (Wcf_User_Guilder.isEmail(ls_email.val()) && ls_code.val().length > 5) {
                    Wcf_User_Guilder.config.ls_code = ls_code.val();
                    Wcf_User_Guilder.config.ls_email = ls_email.val();
                    Wcf_User_Guilder.config.user_submitted = true;
                    Wcf_User_Guilder.config.current_g_activitiy = true;
                    Wcf_User_Guilder.check_license_activation();
                } else {
                    Wcf_User_Guilder.config.user_submitted = false;
                }

                if (!ls_code.val().length) {
                    ls_code.focus();
                }

                if (!Wcf_User_Guilder.isEmail(ls_email.val())) {
                    ls_email.focus();
                }

            });

            $(document).on('click', '.wcf--plugins-install-button', function () {
                Wcf_User_Guilder.plugin_status_update(true);
            });

            $(document).on('click', '#wcf--deactivate-ls', function () {

                if (confirm("Would you like to deactivate theme ?") == true) {
                    Wcf_User_Guilder.deactivate_theme_core_func('ls_remove');
                    $(this).text('Deactivating...');
                }

            });

        },

        isEmail: function (email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        },

        theme_left_banner_update: function () {
            let html = ``;
            if (Wcf_User_Guilder.config.has_update && 1==2) {
                html = `
                    <h3>Update is available</h3>
                    <p>Unleash your creativity with the Info Template versatile platform</p>
                    <a href="${Wcf_User_Guilder.config.update_link}">update now</a>
                `;

            } else {
                html = `
                <h3>Theme Top Features</h3>              
                <ul>
                    <li>Animated Widgets</li>
                    <li>Mega Menu Builder</li>
                    <li>Blog Builder</li>
                    <li>404 Builder</li>
                    <li>Single Post Layouts</li>
                    <li>Template Library</li>
                </ul>                                         
            `;
            }
            
            $('#wcf-theme-update-info').html(html);
        },

        plugin_installation_check: function (callback) {
            Wcf_User_Guilder.plugin_status_update();
            Wcf_User_Guilder.theme_update_status_check();
        },

        plugin_status_update: function (user_action) {
            if (user_action) {
                $('.wcf--plugins-install-button').html($('.wcf--plugins-install-button').html() + Wcf_User_Guilder.config.loader_icon);
                Wcf_User_Guilder.config.current_g_activitiy = true;
            }

            jQuery.ajax({
                type: "post",
                dataType: "json",
                url: ajax_object.ajaxurl,
                data: {
                    action: "wcf_user_guide_ls_installed_plugins",
                    nonce: ajax_object.ajax_nonce,
                    plugins: Wcf_User_Guilder.config._required_plugins,
                    user_action: user_action ? 'yes' : ''
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Wcf_User_Guilder.plugin_status_update(true);
                },
                success: function (response) {

                    let generate_html = $('<ul>');
                    $.each(response.plugin_status, function (k, value) {
                        generate_html.append(`${value}`);
                    });

                    let button_text = 'Install & Activate';

                    if (response.hasOwnProperty('installable_plugins') && response.installable_plugins.length === 0) {
                        button_text = 'Activate';
                    }
                    let plugins_html = `
                    <div class="wcf-license-step-two">
                        <div class="theme-activated">
                            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#40CF79"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.815 5.52859C12.0617 5.78894 12.0617 6.21105 11.815 6.4714L7.60449 10.9158C7.35784 11.1762 6.95795 11.1762 6.7113 10.9158L4.18499 8.24918C3.93834 7.98883 3.93834 7.56672 4.18499 7.30637C4.43163 7.04602 4.83153 7.04602 5.07817 7.30637L7.15789 9.50163L10.9218 5.52859C11.1685 5.26824 11.5684 5.26824 11.815 5.52859Z"/>
                            </svg>
                            Theme activated
                        </div>
                        <h3>Install required plugins</h3>
                        <div class="list">
                            ${generate_html.prop('outerHTML')}
                        </div>
                        <div class="wcf--install-btn-wrap">
                            <button class="wcf--license-default-btn wcf--plugins-install-button">${button_text}</button>
                            <button id="wcf--deactivate-ls" class="wcf--license-default-btn deactivate">Deactivate License</button>
                        </div>
                    </div>
                    `;
                    $('.' + Wcf_User_Guilder.config.dynamic_container).html(plugins_html);

                    if (response.recheck) {
                        Wcf_User_Guilder.plugin_status_update(true);
                    }

                    if (response.all_active) {

                        Wcf_User_Guilder.goto_thankyou_page(response.demo_path);
                    }
                }
            });

        },

        goto_thankyou_page: function (path) {
            let thanks = ``;
            let hidden = parseInt(ajax_object.demo_active) ? '' : 'display:none';
            if (Wcf_User_Guilder.config.current_g_activitiy) {
                thanks = `<h3>Congratulation! </h3>
                <p>You have successfully installed and activated  our theme. Now you can import your desired demo</p>`;
            } else {
                thanks = `<p>You installed and activated our theme. Now you can import your desired demo</p>`;
            }

            let plugins_html = `
            <div class="wcf--license-step-three">
                ${thanks}
                <a href="${path}" class="wcf--license-default-btn wcf--theme-demo-button" style="${hidden}">Import demo</a>
                <a id="wcf--deactivate-ls" class="wcf--license-default-btn deactivate">Deactivate License</a>
                
                <div class="rating-wrap">
                    <h3>
                        <svg width="27" height="26" viewBox="0 0 27 26" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 0L17.8386 8.32612L27 9.93112L20.52 16.6819L21.8435 26L13.5 21.8461L5.15654 26L6.48 16.6819L0 9.93112L9.1614 8.32612L13.5 0Z"/>
                        </svg>
                        Give us rating
                    </h3>
                    <p>Do you love our theme? If you love  please give us a <strong>5 star rating</strong> to support us for continuously development</p>
                    <a href="${Wcf_User_Guilder.config.rating_link}" class="wcf--license-default-btn rating">Give a rating</a>
                </div>
            </div>
            `;

            $('.' + Wcf_User_Guilder.config.dynamic_container).html(plugins_html);
        },
        deactivate_theme_core_func: function (action,actdata=false) {        
           
            let data = {
                action    : "wcf_user_guide_ls_remove",
                edd_action: "deactivate_license",
                status:     'request',
                license   : Wcf_User_Guilder.config.ls_code,
                email     : Wcf_User_Guilder.config.ls_email,
                item_id   : ajax_object.download_id,
                url       : ajax_object.home_url,
                nonce     : ajax_object.ajax_nonce,
            };
            
            if(actdata) {
                data = actdata;
            }
           
            
            jQuery.ajax({
                type: "get",
                dataType: "json",
                url: ajax_object.ajaxurl,
                data: data,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error("Request failed:", textStatus, errorThrown);
                    Wcf_User_Guilder.check_license_activation();
                },
                success: function (response) {                    
                     
                    if(response.next_step == 'done'){
                        location.reload();
                    }
              
                }
            });
            
        },

        theme_update_status_check: function () {
            Wcf_User_Guilder.theme_left_banner_update();
            return;
            if (sessionStorage.getItem('wcf_theme_update_checker')) {
                Wcf_User_Guilder.theme_left_banner_update();
            } else {
                jQuery.ajax({
                    type: "post",
                    dataType: "json",
                    url: ajax_object.ajaxurl,
                    data: {
                        action: "wcf_update_theme_status",
                        slug: 'helo',
                        nonce: ajax_object.ajax_nonce,
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error("Request failed:", textStatus, errorThrown);                        
                    },
                    success: function (response) {
                        if (response.success) {
                            Wcf_User_Guilder.config.has_update = true;
                        } else {
                            Wcf_User_Guilder.config.has_update = false;
                        }
                        sessionStorage.setItem('wcf_theme_update_checker', 1);
                        Wcf_User_Guilder.theme_left_banner_update();
                    }
                });
            }

        },


        check_license_activation: function (action = false, actiondata = false) {
        
            let license_varificfation = ajax_object.license_domain+'wp-json/envatu/license/varification';
            let license_generate = ajax_object.license_domain+'wp-json/envatu/license/attach';
            let license_activate = ajax_object.license_domain+'wp-json/envatu/license/activate';
            let customer_validation = ajax_object.license_domain+'wp-json/envatu/customer/validation';
            let license_order = ajax_object.license_domain+'wp-json/envatu/customer/order';    
            
            if (Wcf_User_Guilder.config.user_submitted) {
                $('.wcf--license-activation-button').val('Loading');
            }
            let axt_url = Wcf_User_Guilder.config.user_submitted ? customer_validation : ajax_object.ajaxurl;    
            if(action){
                axt_url = action; 
            }
            let data = {
                action        : "wcf_user_guide_ls_checker",
                nonce         : ajax_object.ajax_nonce,
                code          : Wcf_User_Guilder.config.ls_code,
                email         : Wcf_User_Guilder.config.ls_email,
                download_id   : ajax_object.download_id,
                url           : ajax_object.home_url,
                order_id      : 0,
                user_submitted: Wcf_User_Guilder.config.user_submitted ? 'yes': 'no'
            };
            
            if(actiondata){
                data = actiondata;
            }
            
            jQuery.ajax({
                type: "GET",
                dataType: "json",
                url: axt_url,
                data: data,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error("Request failed:", textStatus, errorThrown);
                    Wcf_User_Guilder.check_license_activation();
                },
                success: function (response) {                 
                    Wcf_User_Guilder.config.license_active = response.code;                    
                    if( 'next_step' in response ){
                        
                        if( response.next_step == 'activate_license' )
                        {
                            data = {...data, ...response.customer};                           
                            Wcf_User_Guilder.check_license_activation(license_activate, data);                            
                        }
                        
                        if( response.next_step == 'license_varification' )
                        {
                            data = {...data, ...response.customer};                           
                            Wcf_User_Guilder.check_license_activation(license_varificfation, data);  
                        }
                        
                        if( response.next_step == 'order' )
                        {
                            data = {...data, ...response.customer};                           
                            Wcf_User_Guilder.check_license_activation(license_order, data);  
                        }
                        
                        if( response.next_step == 'attach' )
                        {
                            data = {...data, ...response.customer};                           
                            Wcf_User_Guilder.check_license_activation(license_generate, data);  
                        }
                        
                        if( response.next_step == 'done' && 'license' in response ){
                            if(response.license.license == 'valid' ){
                                data = {...data, ...{l_valid: true}};        
                                Wcf_User_Guilder.check_license_activation(ajax_object.ajaxurl, data);   
                            }
                        }
                        
                        if( response.next_step == 'final_license_check' ){
                            Wcf_User_Guilder.config.current_step = 'plugin_check';
                            Wcf_User_Guilder.plugin_installation_check();  
                        }
                        
                    }
                                      
                    
                    let button_text = 'Activate';                  
                    let msgs = response?.msg || response?.data?.msg;
                    if ( response?.data?.msg !== 'valid') {                  
                        let form = `
                            <div class="wcf-license-step-one">
                                <h3>Activate License</h3>
                                <p>Enter your license key here, to activate the product and get full feature updates and premium support.</p>
                                <div style="text-align:center; padding-bottom: 10px; color: #b32d2e;"><b class="wcf-warning-message">${msgs}</b> </div>
                                <div class="el-license-field">
                                    <label for="el_license_key">License Key :</label>
                                    <input type="text" class="regular-text code" name="el_license_key" size="50" placeholder="xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx" required="required">
                                </div>
                                <div class="el-license-field">
                                    <label>your Email :</label>                                
                                    <input type="text" class="regular-text code" name="el_license_email" size="50" value="${response?.data?.email}" placeholder="someone@gmail.com"required="required">
                                </div>
                                <div class="el-license-field">
                                    <label></label>                                
                                    <p>We will send update news of this product by this email address. Don’t worry,
                                    we hate spam</p>
                                </div>
                                <div class="el-license-active-btn">            					
                                    <input type="submit" name="submit" id="submit" class="wcf--license-activation-button" value="${button_text}">
                                </div>
                                <div class="theme-license-steps">
                                    <ul class="list">
                                        <li>Go to your Envato profile</li>
                                        <li>Go to download</li>
                                        <li>Open the “License” PDF file</li>
                                        <li>Copy the license key & paste here</li>
                                    </ul>
                                </div>
                            </div>    
                        `;
                        $('.' + Wcf_User_Guilder.config.dynamic_container).html(form);
                    } else {
                        Wcf_User_Guilder.config.current_step = 'plugin_check';
                        Wcf_User_Guilder.plugin_installation_check();
                    }
                }
            });

        }
    };

    $(document).ready(Wcf_User_Guilder.init);
})(jQuery);


