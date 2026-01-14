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
                    <a href="index.html" data-type="index-link">lib-ui documentation</a>
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
                                    <span class="icon ion-ios-paper"></span>
                                        README
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
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BookBorrowedComponent.html" data-type="entity-link" >BookBorrowedComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BookCardComponent.html" data-type="entity-link" >BookCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BookComponentComponent.html" data-type="entity-link" >BookComponentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BookLayoutComponent.html" data-type="entity-link" >BookLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CategoriesOperationComponent.html" data-type="entity-link" >CategoriesOperationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatAiComponent.html" data-type="entity-link" >ChatAiComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CommonHomeComponent.html" data-type="entity-link" >CommonHomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CycleHubComponent.html" data-type="entity-link" >CycleHubComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent-1.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardPageComponent.html" data-type="entity-link" >DashboardPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DigitalPageComponent.html" data-type="entity-link" >DigitalPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginCallbackComponent.html" data-type="entity-link" >LoginCallbackComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyBookComponent.html" data-type="entity-link" >MyBookComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyProfileComponent.html" data-type="entity-link" >MyProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationComponent.html" data-type="entity-link" >NotificationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileSettingComponent.html" data-type="entity-link" >ProfileSettingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterComponent.html" data-type="entity-link" >RegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" >ResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchBoxComponent.html" data-type="entity-link" >SearchBoxComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingComponent.html" data-type="entity-link" >SettingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SubCategoryComponent.html" data-type="entity-link" >SubCategoryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SuperAdminRegisterComponent.html" data-type="entity-link" >SuperAdminRegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserComponent.html" data-type="entity-link" >UserComponent</a>
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
                                    <a href="directives/AnimatedCounterDirective.html" data-type="entity-link" >AnimatedCounterDirective</a>
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
                                <a href="classes/HeaderParameter.html" data-type="entity-link" >HeaderParameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Parameter.html" data-type="entity-link" >Parameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParameterCodec.html" data-type="entity-link" >ParameterCodec</a>
                            </li>
                            <li class="link">
                                <a href="classes/PathParameter.html" data-type="entity-link" >PathParameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryParameter.html" data-type="entity-link" >QueryParameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestBuilder.html" data-type="entity-link" >RequestBuilder</a>
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
                                    <a href="injectables/Api.html" data-type="entity-link" >Api</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiConfiguration.html" data-type="entity-link" >ApiConfiguration</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthServiceService.html" data-type="entity-link" >AuthServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BookServiceService.html" data-type="entity-link" >BookServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BorrowedBookServiceService.html" data-type="entity-link" >BorrowedBookServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategoryServiceService.html" data-type="entity-link" >CategoryServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubCategoryService.html" data-type="entity-link" >SubCategoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserServiceService.html" data-type="entity-link" >UserServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserStorageSerivceService.html" data-type="entity-link" >UserStorageSerivceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WebSocketServicProgramService.html" data-type="entity-link" >WebSocketServicProgramService</a>
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
                                <a href="interfaces/AddBook$Params.html" data-type="entity-link" >AddBook$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddCategory$Params.html" data-type="entity-link" >AddCategory$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddComment$Params.html" data-type="entity-link" >AddComment$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddSubCategory$Params.html" data-type="entity-link" >AddSubCategory$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdminRegister$Params.html" data-type="entity-link" >AdminRegister$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AllBookBySubCategoryId$Params.html" data-type="entity-link" >AllBookBySubCategoryId$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnnouncementRequest.html" data-type="entity-link" >AnnouncementRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnnouncementResponse.html" data-type="entity-link" >AnnouncementResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookBorrowCheckRequest.html" data-type="entity-link" >BookBorrowCheckRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookDetailResponse.html" data-type="entity-link" >BookDetailResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookRequest.html" data-type="entity-link" >BookRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BookResponse.html" data-type="entity-link" >BookResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BorrowedBook$Params.html" data-type="entity-link" >BorrowedBook$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BorrowedRequest.html" data-type="entity-link" >BorrowedRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BorrowedResponse.html" data-type="entity-link" >BorrowedResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CategoryRequest.html" data-type="entity-link" >CategoryRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CategoryResponse.html" data-type="entity-link" >CategoryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatMessage.html" data-type="entity-link" >ChatMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatStream$Params.html" data-type="entity-link" >ChatStream$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteBookById$Params.html" data-type="entity-link" >DeleteBookById$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteCategoryById$Params.html" data-type="entity-link" >DeleteCategoryById$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteComment$Params.html" data-type="entity-link" >DeleteComment$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteCommentRequest.html" data-type="entity-link" >DeleteCommentRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteFeedBack$Params.html" data-type="entity-link" >DeleteFeedBack$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteSubCategoryById$Params.html" data-type="entity-link" >DeleteSubCategoryById$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DigitalResponse.html" data-type="entity-link" >DigitalResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DigitalResponse-1.html" data-type="entity-link" >DigitalResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DownloadBookFile$Params.html" data-type="entity-link" >DownloadBookFile$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DownloadFile$Params.html" data-type="entity-link" >DownloadFile$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAll$Params.html" data-type="entity-link" >GetAll$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAllBooks$Params.html" data-type="entity-link" >GetAllBooks$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAllBorrowedList$Params.html" data-type="entity-link" >GetAllBorrowedList$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAllCategories$Params.html" data-type="entity-link" >GetAllCategories$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAllRatingByBookId$Params.html" data-type="entity-link" >GetAllRatingByBookId$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAllRecycleHubDetails$Params.html" data-type="entity-link" >GetAllRecycleHubDetails$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAllSubCategory$Params.html" data-type="entity-link" >GetAllSubCategory$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAllUser$Params.html" data-type="entity-link" >GetAllUser$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetBookById$Params.html" data-type="entity-link" >GetBookById$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetBookByName$Params.html" data-type="entity-link" >GetBookByName$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetBookDetails$Params.html" data-type="entity-link" >GetBookDetails$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetBorrowedByUserId$Params.html" data-type="entity-link" >GetBorrowedByUserId$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetCategoryByName$Params.html" data-type="entity-link" >GetCategoryByName$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetDetailsUpperRating$Params.html" data-type="entity-link" >GetDetailsUpperRating$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetDigitalPage$Params.html" data-type="entity-link" >GetDigitalPage$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetRatingFeedBackByUserId$Params.html" data-type="entity-link" >GetRatingFeedBackByUserId$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetSimilarBooks$Params.html" data-type="entity-link" >GetSimilarBooks$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetSubCategoryByCategoryId$Params.html" data-type="entity-link" >GetSubCategoryByCategoryId$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetSubCategoryId$Params.html" data-type="entity-link" >GetSubCategoryId$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetTopRatingBook$Params.html" data-type="entity-link" >GetTopRatingBook$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetUserByEmail$Params.html" data-type="entity-link" >GetUserByEmail$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetUserByRole$Params.html" data-type="entity-link" >GetUserByRole$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GiveBookRating$Params.html" data-type="entity-link" >GiveBookRating$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IsBookBorrowed$Params.html" data-type="entity-link" >IsBookBorrowed$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Login$Params.html" data-type="entity-link" >Login$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginRequest.html" data-type="entity-link" >LoginRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponse.html" data-type="entity-link" >LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MakeUnRead$Params.html" data-type="entity-link" >MakeUnRead$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MarkRead$Params.html" data-type="entity-link" >MarkRead$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MostPopularBook$Params.html" data-type="entity-link" >MostPopularBook$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyJwtPayload.html" data-type="entity-link" >MyJwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageableObject.html" data-type="entity-link" >PageableObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageBookResponse.html" data-type="entity-link" >PageBookResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageBorrowedResponse.html" data-type="entity-link" >PageBorrowedResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageCategoryResponse.html" data-type="entity-link" >PageCategoryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageRatingFeedBackResponse.html" data-type="entity-link" >PageRatingFeedBackResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageSubCategoryResponse.html" data-type="entity-link" >PageSubCategoryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageUserResponse.html" data-type="entity-link" >PageUserResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParameterOptions.html" data-type="entity-link" >ParameterOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordResetData.html" data-type="entity-link" >PasswordResetData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PostAnnouncement$Params.html" data-type="entity-link" >PostAnnouncement$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PostAnnouncement$Params-1.html" data-type="entity-link" >PostAnnouncement$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RatingFeedbackDetailResponse.html" data-type="entity-link" >RatingFeedbackDetailResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RatingFeedBackResponse.html" data-type="entity-link" >RatingFeedBackResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RatingRequest.html" data-type="entity-link" >RatingRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RatingUpperDetailsResponse.html" data-type="entity-link" >RatingUpperDetailsResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecommendationBook$Params.html" data-type="entity-link" >RecommendationBook$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecycleHubResponse.html" data-type="entity-link" >RecycleHubResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecycleHubResponse-1.html" data-type="entity-link" >RecycleHubResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RefreshToken$Params.html" data-type="entity-link" >RefreshToken$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Register$Params.html" data-type="entity-link" >Register$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReturnedBook$Params.html" data-type="entity-link" >ReturnedBook$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchBook$Params.html" data-type="entity-link" >SearchBook$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendOtp$Params.html" data-type="entity-link" >SendOtp$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServerSentEventString.html" data-type="entity-link" >ServerSentEventString</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SortObject.html" data-type="entity-link" >SortObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubCategoryRequest.html" data-type="entity-link" >SubCategoryRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubCategoryResponse.html" data-type="entity-link" >SubCategoryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrendingBook$Params.html" data-type="entity-link" >TrendingBook$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UnreadCount$Params.html" data-type="entity-link" >UnreadCount$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateBookById$Params.html" data-type="entity-link" >UpdateBookById$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateBookReturnIssueDate$Params.html" data-type="entity-link" >UpdateBookReturnIssueDate$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateBookStatus$Params.html" data-type="entity-link" >UpdateBookStatus$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateCategory$Params.html" data-type="entity-link" >UpdateCategory$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateComment$Params.html" data-type="entity-link" >UpdateComment$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateCommentRequest.html" data-type="entity-link" >UpdateCommentRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateSubCategory$Params.html" data-type="entity-link" >UpdateSubCategory$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateUserInfo$Params.html" data-type="entity-link" >UpdateUserInfo$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadBookImage$Params.html" data-type="entity-link" >UploadBookImage$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadProfile$Params.html" data-type="entity-link" >UploadProfile$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRequest.html" data-type="entity-link" >UserRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VerifyOtp$Params.html" data-type="entity-link" >VerifyOtp$Params</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VerifyOtpAndChangePassword$Params.html" data-type="entity-link" >VerifyOtpAndChangePassword$Params</a>
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
                                    <a href="pipes/CapitalizationPipe.html" data-type="entity-link" >CapitalizationPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/SortContentPipePipe.html" data-type="entity-link" >SortContentPipePipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/TimePipePipe.html" data-type="entity-link" >TimePipePipe</a>
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
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
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
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
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