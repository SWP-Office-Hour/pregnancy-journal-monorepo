'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@pregnancy-journal/source documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AdminComponent.html" data-type="entity-link" >AdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminLayoutComponent.html" data-type="entity-link" >AdminLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthConfirmationRequiredComponent.html" data-type="entity-link" >AuthConfirmationRequiredComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthResetPasswordComponent.html" data-type="entity-link" >AuthResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthSignInComponent.html" data-type="entity-link" >AuthSignInComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthSignInWithGoogleComponent.html" data-type="entity-link" >AuthSignInWithGoogleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthSignOutComponent.html" data-type="entity-link" >AuthSignOutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthSignUpComponent.html" data-type="entity-link" >AuthSignUpComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogComponent.html" data-type="entity-link" >BlogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogDetailComponent.html" data-type="entity-link" >BlogDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogEditorComponent.html" data-type="entity-link" >BlogEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogMasonryComponent.html" data-type="entity-link" >BlogMasonryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CalendarComponent.html" data-type="entity-link" >CalendarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CategoryTableComponent.html" data-type="entity-link" >CategoryTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CenteredLayoutComponent.html" data-type="entity-link" >CenteredLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChangePasswordComponent.html" data-type="entity-link" >ChangePasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChartCombo.html" data-type="entity-link" >ChartCombo</a>
                            </li>
                            <li class="link">
                                <a href="components/ChildrenProfileComponent.html" data-type="entity-link" >ChildrenProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChildrenProfileSelectorComponent.html" data-type="entity-link" >ChildrenProfileSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClassicLayoutComponent.html" data-type="entity-link" >ClassicLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClassyLayoutComponent.html" data-type="entity-link" >ClassyLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CommunityComponent.html" data-type="entity-link" >CommunityComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CompactLayoutComponent.html" data-type="entity-link" >CompactLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreatePostComponent.html" data-type="entity-link" >CreatePostComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DenseLayoutComponent.html" data-type="entity-link" >DenseLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogComponent.html" data-type="entity-link" >DialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogContentPriceComponent.html" data-type="entity-link" >DialogContentPriceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogImgComponent.html" data-type="entity-link" >DialogImgComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmptyLayoutComponent.html" data-type="entity-link" >EmptyLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EnterpriseLayoutComponent.html" data-type="entity-link" >EnterpriseLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Error404Component.html" data-type="entity-link" >Error404Component</a>
                            </li>
                            <li class="link">
                                <a href="components/FeaturesComponent.html" data-type="entity-link" >FeaturesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileUploadComponent.html" data-type="entity-link" >FileUploadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" >ForgotPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormComponent.html" data-type="entity-link" >FormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseAlertComponent.html" data-type="entity-link" >FuseAlertComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseCardComponent.html" data-type="entity-link" >FuseCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseConfirmationDialogComponent.html" data-type="entity-link" >FuseConfirmationDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseDrawerComponent.html" data-type="entity-link" >FuseDrawerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseFullscreenComponent.html" data-type="entity-link" >FuseFullscreenComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseHighlightComponent.html" data-type="entity-link" >FuseHighlightComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseHorizontalNavigationBasicItemComponent.html" data-type="entity-link" >FuseHorizontalNavigationBasicItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseHorizontalNavigationBranchItemComponent.html" data-type="entity-link" >FuseHorizontalNavigationBranchItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseHorizontalNavigationComponent.html" data-type="entity-link" >FuseHorizontalNavigationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseHorizontalNavigationDividerItemComponent.html" data-type="entity-link" >FuseHorizontalNavigationDividerItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseHorizontalNavigationSpacerItemComponent.html" data-type="entity-link" >FuseHorizontalNavigationSpacerItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseLoadingBarComponent.html" data-type="entity-link" >FuseLoadingBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseMasonryComponent.html" data-type="entity-link" >FuseMasonryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseVerticalNavigationAsideItemComponent.html" data-type="entity-link" >FuseVerticalNavigationAsideItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseVerticalNavigationBasicItemComponent.html" data-type="entity-link" >FuseVerticalNavigationBasicItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseVerticalNavigationCollapsableItemComponent.html" data-type="entity-link" >FuseVerticalNavigationCollapsableItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseVerticalNavigationComponent.html" data-type="entity-link" >FuseVerticalNavigationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseVerticalNavigationDividerItemComponent.html" data-type="entity-link" >FuseVerticalNavigationDividerItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseVerticalNavigationGroupItemComponent.html" data-type="entity-link" >FuseVerticalNavigationGroupItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuseVerticalNavigationSpacerItemComponent.html" data-type="entity-link" >FuseVerticalNavigationSpacerItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FuturisticLayoutComponent.html" data-type="entity-link" >FuturisticLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HealthMetricTableComponent.html" data-type="entity-link" >HealthMetricTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeNoteComponent.html" data-type="entity-link" >HomeNoteComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeReminderComponent.html" data-type="entity-link" >HomeReminderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HospitalTableComponent.html" data-type="entity-link" >HospitalTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImagePreviewComponent.html" data-type="entity-link" >ImagePreviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LandingComponent.html" data-type="entity-link" >LandingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LandingLayoutComponent.html" data-type="entity-link" >LandingLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LanguagesComponent.html" data-type="entity-link" >LanguagesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LayoutComponent.html" data-type="entity-link" >LayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LineChartComponent.html" data-type="entity-link" >LineChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MaterialLayoutComponent.html" data-type="entity-link" >MaterialLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipAnalysis.html" data-type="entity-link" >MembershipAnalysis</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipCardComponent.html" data-type="entity-link" >MembershipCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipComponent.html" data-type="entity-link" >MembershipComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipDetailComponent.html" data-type="entity-link" >MembershipDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipListComponent.html" data-type="entity-link" >MembershipListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipTableComponent.html" data-type="entity-link" >MembershipTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MessagesComponent.html" data-type="entity-link" >MessagesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModernLayoutComponent.html" data-type="entity-link" >ModernLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NoteDetailComponent.html" data-type="entity-link" >NoteDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationsComponent.html" data-type="entity-link" >NotificationsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PaymentTableComponent.html" data-type="entity-link" >PaymentTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PregnancyRecordComponent.html" data-type="entity-link" >PregnancyRecordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PregnancyRecordViewComponent.html" data-type="entity-link" >PregnancyRecordViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PregnancyTrackingComponent.html" data-type="entity-link" >PregnancyTrackingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PregnancyWeekInfoComponent.html" data-type="entity-link" >PregnancyWeekInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/QuickChatComponent.html" data-type="entity-link" >QuickChatComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RecommendedBlogsComponent.html" data-type="entity-link" >RecommendedBlogsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RecordFormComponent.html" data-type="entity-link" >RecordFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RecordTableComponent.html" data-type="entity-link" >RecordTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReminderEditorComponent.html" data-type="entity-link" >ReminderEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RevenueStreamWidget.html" data-type="entity-link" >RevenueStreamWidget</a>
                            </li>
                            <li class="link">
                                <a href="components/StandardTableComponent.html" data-type="entity-link" >StandardTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatsWidget.html" data-type="entity-link" >StatsWidget</a>
                            </li>
                            <li class="link">
                                <a href="components/TagTableComponent.html" data-type="entity-link" >TagTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThinLayoutComponent.html" data-type="entity-link" >ThinLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TrackingFormComponent.html" data-type="entity-link" >TrackingFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserComponent.html" data-type="entity-link" >UserComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserProfileComponent.html" data-type="entity-link" >UserProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserSearchComponent.html" data-type="entity-link" >UserSearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserTableComponent.html" data-type="entity-link" >UserTableComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/FuseScrollbarDirective.html" data-type="entity-link" >FuseScrollbarDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/FuseScrollResetDirective.html" data-type="entity-link" >FuseScrollResetDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuthUtils.html" data-type="entity-link" >AuthUtils</a>
                            </li>
                            <li class="link">
                                <a href="classes/FuseAnimationCurves.html" data-type="entity-link" >FuseAnimationCurves</a>
                            </li>
                            <li class="link">
                                <a href="classes/FuseAnimationDurations.html" data-type="entity-link" >FuseAnimationDurations</a>
                            </li>
                            <li class="link">
                                <a href="classes/FuseMockApiHandler.html" data-type="entity-link" >FuseMockApiHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FuseMockApiUtils.html" data-type="entity-link" >FuseMockApiUtils</a>
                            </li>
                            <li class="link">
                                <a href="classes/FuseValidators.html" data-type="entity-link" >FuseValidators</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScrollbarGeometry.html" data-type="entity-link" >ScrollbarGeometry</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScrollbarPosition.html" data-type="entity-link" >ScrollbarPosition</a>
                            </li>
                            <li class="link">
                                <a href="classes/Version.html" data-type="entity-link" >Version</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminMockApi.html" data-type="entity-link" >AdminMockApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthGoogleService.html" data-type="entity-link" >AuthGoogleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthMockApi.html" data-type="entity-link" >AuthMockApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BlogMasonryService.html" data-type="entity-link" >BlogMasonryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BlogsService.html" data-type="entity-link" >BlogsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CalendarService.html" data-type="entity-link" >CalendarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatMockApi.html" data-type="entity-link" >ChatMockApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseAlertService.html" data-type="entity-link" >FuseAlertService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseConfigService.html" data-type="entity-link" >FuseConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseConfirmationService.html" data-type="entity-link" >FuseConfirmationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseDrawerService.html" data-type="entity-link" >FuseDrawerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseHighlightService.html" data-type="entity-link" >FuseHighlightService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseLoadingService.html" data-type="entity-link" >FuseLoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseMediaWatcherService.html" data-type="entity-link" >FuseMediaWatcherService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseMockApiService.html" data-type="entity-link" >FuseMockApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseNavigationService.html" data-type="entity-link" >FuseNavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FusePlatformService.html" data-type="entity-link" >FusePlatformService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseSplashScreenService.html" data-type="entity-link" >FuseSplashScreenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuseUtilsService.html" data-type="entity-link" >FuseUtilsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IconsMockApi.html" data-type="entity-link" >IconsMockApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IconsService.html" data-type="entity-link" >IconsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/membershipService.html" data-type="entity-link" >membershipService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessagesMockApi.html" data-type="entity-link" >MessagesMockApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessagesService.html" data-type="entity-link" >MessagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MockApiService.html" data-type="entity-link" >MockApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationMockApi.html" data-type="entity-link" >NavigationMockApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsMockApi.html" data-type="entity-link" >NotificationsMockApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link" >NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostService.html" data-type="entity-link" >PostService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PregnancyRecordService.html" data-type="entity-link" >PregnancyRecordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PregnancyRecordViewService.html" data-type="entity-link" >PregnancyRecordViewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PregnancyTrackingService.html" data-type="entity-link" >PregnancyTrackingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuickChatService.html" data-type="entity-link" >QuickChatService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TranslocoHttpLoader.html" data-type="entity-link" >TranslocoHttpLoader</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserMockApi.html" data-type="entity-link" >UserMockApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Chat.html" data-type="entity-link" >Chat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Child.html" data-type="entity-link" >Child</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Contact.html" data-type="entity-link" >Contact</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DateInput.html" data-type="entity-link" >DateInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/District.html" data-type="entity-link" >District</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FormOutput.html" data-type="entity-link" >FormOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FuseConfig.html" data-type="entity-link" >FuseConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FuseConfirmationConfig.html" data-type="entity-link" >FuseConfirmationConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FuseNavigationItem.html" data-type="entity-link" >FuseNavigationItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Gender.html" data-type="entity-link" >Gender</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Navigation.html" data-type="entity-link" >Navigation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NoteDetailDialogData.html" data-type="entity-link" >NoteDetailDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NumberInput.html" data-type="entity-link" >NumberInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Province.html" data-type="entity-link" >Province</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectInput.html" data-type="entity-link" >SelectInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SystemReminder.html" data-type="entity-link" >SystemReminder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TextInput.html" data-type="entity-link" >TextInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Theme.html" data-type="entity-link" >Theme</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User-1.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Ward.html" data-type="entity-link" >Ward</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/FuseFindByKeyPipe.html" data-type="entity-link" >FuseFindByKeyPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});