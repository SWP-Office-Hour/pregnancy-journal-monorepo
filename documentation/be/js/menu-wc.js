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
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AdminModule-4f85b5bc29a4e853a9f91a25eb959fa34e0aba15942ef699bc75659a2d11bb4e646ff251467b8c0248ed14a641954d3d6efd2e6bbb75707ebdb0247c0be21741"' : 'data-bs-target="#xs-controllers-links-module-AdminModule-4f85b5bc29a4e853a9f91a25eb959fa34e0aba15942ef699bc75659a2d11bb4e646ff251467b8c0248ed14a641954d3d6efd2e6bbb75707ebdb0247c0be21741"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AdminModule-4f85b5bc29a4e853a9f91a25eb959fa34e0aba15942ef699bc75659a2d11bb4e646ff251467b8c0248ed14a641954d3d6efd2e6bbb75707ebdb0247c0be21741"' :
                                            'id="xs-controllers-links-module-AdminModule-4f85b5bc29a4e853a9f91a25eb959fa34e0aba15942ef699bc75659a2d11bb4e646ff251467b8c0248ed14a641954d3d6efd2e6bbb75707ebdb0247c0be21741"' }>
                                            <li class="link">
                                                <a href="controllers/AdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AdminModule-4f85b5bc29a4e853a9f91a25eb959fa34e0aba15942ef699bc75659a2d11bb4e646ff251467b8c0248ed14a641954d3d6efd2e6bbb75707ebdb0247c0be21741"' : 'data-bs-target="#xs-injectables-links-module-AdminModule-4f85b5bc29a4e853a9f91a25eb959fa34e0aba15942ef699bc75659a2d11bb4e646ff251467b8c0248ed14a641954d3d6efd2e6bbb75707ebdb0247c0be21741"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminModule-4f85b5bc29a4e853a9f91a25eb959fa34e0aba15942ef699bc75659a2d11bb4e646ff251467b8c0248ed14a641954d3d6efd2e6bbb75707ebdb0247c0be21741"' :
                                        'id="xs-injectables-links-module-AdminModule-4f85b5bc29a4e853a9f91a25eb959fa34e0aba15942ef699bc75659a2d11bb4e646ff251467b8c0248ed14a641954d3d6efd2e6bbb75707ebdb0247c0be21741"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-1b2368d313896a70a67e05958bd6ba00727916863641d961434832adf42d315336e165c5113bd1bef85422fc9495a17ea2e3065cf6d2506df4bc05a10253c043"' : 'data-bs-target="#xs-controllers-links-module-AppModule-1b2368d313896a70a67e05958bd6ba00727916863641d961434832adf42d315336e165c5113bd1bef85422fc9495a17ea2e3065cf6d2506df4bc05a10253c043"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-1b2368d313896a70a67e05958bd6ba00727916863641d961434832adf42d315336e165c5113bd1bef85422fc9495a17ea2e3065cf6d2506df4bc05a10253c043"' :
                                            'id="xs-controllers-links-module-AppModule-1b2368d313896a70a67e05958bd6ba00727916863641d961434832adf42d315336e165c5113bd1bef85422fc9495a17ea2e3065cf6d2506df4bc05a10253c043"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-1b2368d313896a70a67e05958bd6ba00727916863641d961434832adf42d315336e165c5113bd1bef85422fc9495a17ea2e3065cf6d2506df4bc05a10253c043"' : 'data-bs-target="#xs-injectables-links-module-AppModule-1b2368d313896a70a67e05958bd6ba00727916863641d961434832adf42d315336e165c5113bd1bef85422fc9495a17ea2e3065cf6d2506df4bc05a10253c043"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-1b2368d313896a70a67e05958bd6ba00727916863641d961434832adf42d315336e165c5113bd1bef85422fc9495a17ea2e3065cf6d2506df4bc05a10253c043"' :
                                        'id="xs-injectables-links-module-AppModule-1b2368d313896a70a67e05958bd6ba00727916863641d961434832adf42d315336e165c5113bd1bef85422fc9495a17ea2e3065cf6d2506df4bc05a10253c043"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BlogsModule.html" data-type="entity-link" >BlogsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BlogsModule-a0e93f25ba58fecc6152d1631569e407dd433c7f41858b55761eac403b5229faed8a49538442ee5115e2bfb749f96dc29f869ae0f400caa7cc4e42500e830385"' : 'data-bs-target="#xs-controllers-links-module-BlogsModule-a0e93f25ba58fecc6152d1631569e407dd433c7f41858b55761eac403b5229faed8a49538442ee5115e2bfb749f96dc29f869ae0f400caa7cc4e42500e830385"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BlogsModule-a0e93f25ba58fecc6152d1631569e407dd433c7f41858b55761eac403b5229faed8a49538442ee5115e2bfb749f96dc29f869ae0f400caa7cc4e42500e830385"' :
                                            'id="xs-controllers-links-module-BlogsModule-a0e93f25ba58fecc6152d1631569e407dd433c7f41858b55761eac403b5229faed8a49538442ee5115e2bfb749f96dc29f869ae0f400caa7cc4e42500e830385"' }>
                                            <li class="link">
                                                <a href="controllers/BlogsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlogsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BlogsModule-a0e93f25ba58fecc6152d1631569e407dd433c7f41858b55761eac403b5229faed8a49538442ee5115e2bfb749f96dc29f869ae0f400caa7cc4e42500e830385"' : 'data-bs-target="#xs-injectables-links-module-BlogsModule-a0e93f25ba58fecc6152d1631569e407dd433c7f41858b55761eac403b5229faed8a49538442ee5115e2bfb749f96dc29f869ae0f400caa7cc4e42500e830385"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BlogsModule-a0e93f25ba58fecc6152d1631569e407dd433c7f41858b55761eac403b5229faed8a49538442ee5115e2bfb749f96dc29f869ae0f400caa7cc4e42500e830385"' :
                                        'id="xs-injectables-links-module-BlogsModule-a0e93f25ba58fecc6152d1631569e407dd433c7f41858b55761eac403b5229faed8a49538442ee5115e2bfb749f96dc29f869ae0f400caa7cc4e42500e830385"' }>
                                        <li class="link">
                                            <a href="injectables/BlogsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlogsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategorysModule.html" data-type="entity-link" >CategorysModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CategorysModule-e8e94bcb4ce084a8b47a5b2713a22d17b91dfb553780f060be41bc993fccb8ef36da7e00224c7ff00bad7a6db7972d06c33b04933d6878bff060dc63adbe213b"' : 'data-bs-target="#xs-controllers-links-module-CategorysModule-e8e94bcb4ce084a8b47a5b2713a22d17b91dfb553780f060be41bc993fccb8ef36da7e00224c7ff00bad7a6db7972d06c33b04933d6878bff060dc63adbe213b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CategorysModule-e8e94bcb4ce084a8b47a5b2713a22d17b91dfb553780f060be41bc993fccb8ef36da7e00224c7ff00bad7a6db7972d06c33b04933d6878bff060dc63adbe213b"' :
                                            'id="xs-controllers-links-module-CategorysModule-e8e94bcb4ce084a8b47a5b2713a22d17b91dfb553780f060be41bc993fccb8ef36da7e00224c7ff00bad7a6db7972d06c33b04933d6878bff060dc63adbe213b"' }>
                                            <li class="link">
                                                <a href="controllers/CategorysController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategorysController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CategorysModule-e8e94bcb4ce084a8b47a5b2713a22d17b91dfb553780f060be41bc993fccb8ef36da7e00224c7ff00bad7a6db7972d06c33b04933d6878bff060dc63adbe213b"' : 'data-bs-target="#xs-injectables-links-module-CategorysModule-e8e94bcb4ce084a8b47a5b2713a22d17b91dfb553780f060be41bc993fccb8ef36da7e00224c7ff00bad7a6db7972d06c33b04933d6878bff060dc63adbe213b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategorysModule-e8e94bcb4ce084a8b47a5b2713a22d17b91dfb553780f060be41bc993fccb8ef36da7e00224c7ff00bad7a6db7972d06c33b04933d6878bff060dc63adbe213b"' :
                                        'id="xs-injectables-links-module-CategorysModule-e8e94bcb4ce084a8b47a5b2713a22d17b91dfb553780f060be41bc993fccb8ef36da7e00224c7ff00bad7a6db7972d06c33b04933d6878bff060dc63adbe213b"' }>
                                        <li class="link">
                                            <a href="injectables/CategorysService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategorysService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommentsModule.html" data-type="entity-link" >CommentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CommentsModule-e7d06d5db65f466d9792757d81e2970d09ece7ee51f8209f67f759b0b78b29391f9ee511453f949721f0866180d58449c4579380dbee8f2bd93ebf093943c7a4"' : 'data-bs-target="#xs-controllers-links-module-CommentsModule-e7d06d5db65f466d9792757d81e2970d09ece7ee51f8209f67f759b0b78b29391f9ee511453f949721f0866180d58449c4579380dbee8f2bd93ebf093943c7a4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CommentsModule-e7d06d5db65f466d9792757d81e2970d09ece7ee51f8209f67f759b0b78b29391f9ee511453f949721f0866180d58449c4579380dbee8f2bd93ebf093943c7a4"' :
                                            'id="xs-controllers-links-module-CommentsModule-e7d06d5db65f466d9792757d81e2970d09ece7ee51f8209f67f759b0b78b29391f9ee511453f949721f0866180d58449c4579380dbee8f2bd93ebf093943c7a4"' }>
                                            <li class="link">
                                                <a href="controllers/CommentsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CommentsModule-e7d06d5db65f466d9792757d81e2970d09ece7ee51f8209f67f759b0b78b29391f9ee511453f949721f0866180d58449c4579380dbee8f2bd93ebf093943c7a4"' : 'data-bs-target="#xs-injectables-links-module-CommentsModule-e7d06d5db65f466d9792757d81e2970d09ece7ee51f8209f67f759b0b78b29391f9ee511453f949721f0866180d58449c4579380dbee8f2bd93ebf093943c7a4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommentsModule-e7d06d5db65f466d9792757d81e2970d09ece7ee51f8209f67f759b0b78b29391f9ee511453f949721f0866180d58449c4579380dbee8f2bd93ebf093943c7a4"' :
                                        'id="xs-injectables-links-module-CommentsModule-e7d06d5db65f466d9792757d81e2970d09ece7ee51f8209f67f759b0b78b29391f9ee511453f949721f0866180d58449c4579380dbee8f2bd93ebf093943c7a4"' }>
                                        <li class="link">
                                            <a href="injectables/CommentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FileModule.html" data-type="entity-link" >FileModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FileModule-4e8e64fe95e22a0a47c236eea9fe55476e47450d9b35982a0577ac9c013c97f1d5124669475167b59481d1f08c07e82c252cab7a86a1d05a3ad681522c97f411"' : 'data-bs-target="#xs-injectables-links-module-FileModule-4e8e64fe95e22a0a47c236eea9fe55476e47450d9b35982a0577ac9c013c97f1d5124669475167b59481d1f08c07e82c252cab7a86a1d05a3ad681522c97f411"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FileModule-4e8e64fe95e22a0a47c236eea9fe55476e47450d9b35982a0577ac9c013c97f1d5124669475167b59481d1f08c07e82c252cab7a86a1d05a3ad681522c97f411"' :
                                        'id="xs-injectables-links-module-FileModule-4e8e64fe95e22a0a47c236eea9fe55476e47450d9b35982a0577ac9c013c97f1d5124669475167b59481d1f08c07e82c252cab7a86a1d05a3ad681522c97f411"' }>
                                        <li class="link">
                                            <a href="injectables/FileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HospitalModule.html" data-type="entity-link" >HospitalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HospitalModule-1f619c20c998a307c62a313e164133a32fb9da22c5524935ae71d769142c62ebdc5bfe1a7ee50a4f0d0e5aeae982701c88f669ae110c9e4a7157b9d691ee38c1"' : 'data-bs-target="#xs-controllers-links-module-HospitalModule-1f619c20c998a307c62a313e164133a32fb9da22c5524935ae71d769142c62ebdc5bfe1a7ee50a4f0d0e5aeae982701c88f669ae110c9e4a7157b9d691ee38c1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HospitalModule-1f619c20c998a307c62a313e164133a32fb9da22c5524935ae71d769142c62ebdc5bfe1a7ee50a4f0d0e5aeae982701c88f669ae110c9e4a7157b9d691ee38c1"' :
                                            'id="xs-controllers-links-module-HospitalModule-1f619c20c998a307c62a313e164133a32fb9da22c5524935ae71d769142c62ebdc5bfe1a7ee50a4f0d0e5aeae982701c88f669ae110c9e4a7157b9d691ee38c1"' }>
                                            <li class="link">
                                                <a href="controllers/HospitalController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HospitalController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HospitalModule-1f619c20c998a307c62a313e164133a32fb9da22c5524935ae71d769142c62ebdc5bfe1a7ee50a4f0d0e5aeae982701c88f669ae110c9e4a7157b9d691ee38c1"' : 'data-bs-target="#xs-injectables-links-module-HospitalModule-1f619c20c998a307c62a313e164133a32fb9da22c5524935ae71d769142c62ebdc5bfe1a7ee50a4f0d0e5aeae982701c88f669ae110c9e4a7157b9d691ee38c1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HospitalModule-1f619c20c998a307c62a313e164133a32fb9da22c5524935ae71d769142c62ebdc5bfe1a7ee50a4f0d0e5aeae982701c88f669ae110c9e4a7157b9d691ee38c1"' :
                                        'id="xs-injectables-links-module-HospitalModule-1f619c20c998a307c62a313e164133a32fb9da22c5524935ae71d769142c62ebdc5bfe1a7ee50a4f0d0e5aeae982701c88f669ae110c9e4a7157b9d691ee38c1"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HospitalService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HospitalService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/JwtUtilsModule.html" data-type="entity-link" >JwtUtilsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-JwtUtilsModule-573977fcf5a6a1a209cee3f02cc7b2b7f88ac7776af3a5d5f71151d5bb81deadaaae60bbcdd81df9f0e5314deaf7b936f83c56c996153c162a2100a479cf01d6"' : 'data-bs-target="#xs-injectables-links-module-JwtUtilsModule-573977fcf5a6a1a209cee3f02cc7b2b7f88ac7776af3a5d5f71151d5bb81deadaaae60bbcdd81df9f0e5314deaf7b936f83c56c996153c162a2100a479cf01d6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-JwtUtilsModule-573977fcf5a6a1a209cee3f02cc7b2b7f88ac7776af3a5d5f71151d5bb81deadaaae60bbcdd81df9f0e5314deaf7b936f83c56c996153c162a2100a479cf01d6"' :
                                        'id="xs-injectables-links-module-JwtUtilsModule-573977fcf5a6a1a209cee3f02cc7b2b7f88ac7776af3a5d5f71151d5bb81deadaaae60bbcdd81df9f0e5314deaf7b936f83c56c996153c162a2100a479cf01d6"' }>
                                        <li class="link">
                                            <a href="injectables/JwtUtilsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtUtilsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MailModule-9571fe597cebe7b05973f870fe7325f8d69f592e74631fe4bc706b86b991f03769ec3427aada7e8de5e2be31a5e9ca4763d13e30000bbb30a6509220d7b90add"' : 'data-bs-target="#xs-controllers-links-module-MailModule-9571fe597cebe7b05973f870fe7325f8d69f592e74631fe4bc706b86b991f03769ec3427aada7e8de5e2be31a5e9ca4763d13e30000bbb30a6509220d7b90add"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MailModule-9571fe597cebe7b05973f870fe7325f8d69f592e74631fe4bc706b86b991f03769ec3427aada7e8de5e2be31a5e9ca4763d13e30000bbb30a6509220d7b90add"' :
                                            'id="xs-controllers-links-module-MailModule-9571fe597cebe7b05973f870fe7325f8d69f592e74631fe4bc706b86b991f03769ec3427aada7e8de5e2be31a5e9ca4763d13e30000bbb30a6509220d7b90add"' }>
                                            <li class="link">
                                                <a href="controllers/MailController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MailModule-9571fe597cebe7b05973f870fe7325f8d69f592e74631fe4bc706b86b991f03769ec3427aada7e8de5e2be31a5e9ca4763d13e30000bbb30a6509220d7b90add"' : 'data-bs-target="#xs-injectables-links-module-MailModule-9571fe597cebe7b05973f870fe7325f8d69f592e74631fe4bc706b86b991f03769ec3427aada7e8de5e2be31a5e9ca4763d13e30000bbb30a6509220d7b90add"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-9571fe597cebe7b05973f870fe7325f8d69f592e74631fe4bc706b86b991f03769ec3427aada7e8de5e2be31a5e9ca4763d13e30000bbb30a6509220d7b90add"' :
                                        'id="xs-injectables-links-module-MailModule-9571fe597cebe7b05973f870fe7325f8d69f592e74631fe4bc706b86b991f03769ec3427aada7e8de5e2be31a5e9ca4763d13e30000bbb30a6509220d7b90add"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MediaModule.html" data-type="entity-link" >MediaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MediaModule-228fbc817fbaefa98d541238e02b85a78ebd072e86abe942e1539e18ce633cd51c46308d31edee011ad3c14c76c0214572358823aaf190cd2d85af2e7e06683f"' : 'data-bs-target="#xs-controllers-links-module-MediaModule-228fbc817fbaefa98d541238e02b85a78ebd072e86abe942e1539e18ce633cd51c46308d31edee011ad3c14c76c0214572358823aaf190cd2d85af2e7e06683f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MediaModule-228fbc817fbaefa98d541238e02b85a78ebd072e86abe942e1539e18ce633cd51c46308d31edee011ad3c14c76c0214572358823aaf190cd2d85af2e7e06683f"' :
                                            'id="xs-controllers-links-module-MediaModule-228fbc817fbaefa98d541238e02b85a78ebd072e86abe942e1539e18ce633cd51c46308d31edee011ad3c14c76c0214572358823aaf190cd2d85af2e7e06683f"' }>
                                            <li class="link">
                                                <a href="controllers/MediaController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MediaController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MediaModule-228fbc817fbaefa98d541238e02b85a78ebd072e86abe942e1539e18ce633cd51c46308d31edee011ad3c14c76c0214572358823aaf190cd2d85af2e7e06683f"' : 'data-bs-target="#xs-injectables-links-module-MediaModule-228fbc817fbaefa98d541238e02b85a78ebd072e86abe942e1539e18ce633cd51c46308d31edee011ad3c14c76c0214572358823aaf190cd2d85af2e7e06683f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MediaModule-228fbc817fbaefa98d541238e02b85a78ebd072e86abe942e1539e18ce633cd51c46308d31edee011ad3c14c76c0214572358823aaf190cd2d85af2e7e06683f"' :
                                        'id="xs-injectables-links-module-MediaModule-228fbc817fbaefa98d541238e02b85a78ebd072e86abe942e1539e18ce633cd51c46308d31edee011ad3c14c76c0214572358823aaf190cd2d85af2e7e06683f"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MediaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MediaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MembershipsModule.html" data-type="entity-link" >MembershipsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MembershipsModule-81d305083ee4efa2be113cc4c5c5da40760ea4836ca11b2c663c875c30e4a1c9d846ff513f27cbf79051cf7d7a5df4f4bba0a3090f870b8dd4239169bbecaac9"' : 'data-bs-target="#xs-controllers-links-module-MembershipsModule-81d305083ee4efa2be113cc4c5c5da40760ea4836ca11b2c663c875c30e4a1c9d846ff513f27cbf79051cf7d7a5df4f4bba0a3090f870b8dd4239169bbecaac9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MembershipsModule-81d305083ee4efa2be113cc4c5c5da40760ea4836ca11b2c663c875c30e4a1c9d846ff513f27cbf79051cf7d7a5df4f4bba0a3090f870b8dd4239169bbecaac9"' :
                                            'id="xs-controllers-links-module-MembershipsModule-81d305083ee4efa2be113cc4c5c5da40760ea4836ca11b2c663c875c30e4a1c9d846ff513f27cbf79051cf7d7a5df4f4bba0a3090f870b8dd4239169bbecaac9"' }>
                                            <li class="link">
                                                <a href="controllers/MembershipsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MembershipsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MembershipsModule-81d305083ee4efa2be113cc4c5c5da40760ea4836ca11b2c663c875c30e4a1c9d846ff513f27cbf79051cf7d7a5df4f4bba0a3090f870b8dd4239169bbecaac9"' : 'data-bs-target="#xs-injectables-links-module-MembershipsModule-81d305083ee4efa2be113cc4c5c5da40760ea4836ca11b2c663c875c30e4a1c9d846ff513f27cbf79051cf7d7a5df4f4bba0a3090f870b8dd4239169bbecaac9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MembershipsModule-81d305083ee4efa2be113cc4c5c5da40760ea4836ca11b2c663c875c30e4a1c9d846ff513f27cbf79051cf7d7a5df4f4bba0a3090f870b8dd4239169bbecaac9"' :
                                        'id="xs-injectables-links-module-MembershipsModule-81d305083ee4efa2be113cc4c5c5da40760ea4836ca11b2c663c875c30e4a1c9d846ff513f27cbf79051cf7d7a5df4f4bba0a3090f870b8dd4239169bbecaac9"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MembershipsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MembershipsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MetricModule.html" data-type="entity-link" >MetricModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MetricModule-ed66a7b1741fb5153c4aa0729ac2d2a3dba188726a655bf76ab558887b81d32a43746ac33089f8eb420bf5bb81809cf2ad191cfb0c5a36a8984906eb0e24ceaa"' : 'data-bs-target="#xs-controllers-links-module-MetricModule-ed66a7b1741fb5153c4aa0729ac2d2a3dba188726a655bf76ab558887b81d32a43746ac33089f8eb420bf5bb81809cf2ad191cfb0c5a36a8984906eb0e24ceaa"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MetricModule-ed66a7b1741fb5153c4aa0729ac2d2a3dba188726a655bf76ab558887b81d32a43746ac33089f8eb420bf5bb81809cf2ad191cfb0c5a36a8984906eb0e24ceaa"' :
                                            'id="xs-controllers-links-module-MetricModule-ed66a7b1741fb5153c4aa0729ac2d2a3dba188726a655bf76ab558887b81d32a43746ac33089f8eb420bf5bb81809cf2ad191cfb0c5a36a8984906eb0e24ceaa"' }>
                                            <li class="link">
                                                <a href="controllers/MetricController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MetricModule-ed66a7b1741fb5153c4aa0729ac2d2a3dba188726a655bf76ab558887b81d32a43746ac33089f8eb420bf5bb81809cf2ad191cfb0c5a36a8984906eb0e24ceaa"' : 'data-bs-target="#xs-injectables-links-module-MetricModule-ed66a7b1741fb5153c4aa0729ac2d2a3dba188726a655bf76ab558887b81d32a43746ac33089f8eb420bf5bb81809cf2ad191cfb0c5a36a8984906eb0e24ceaa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MetricModule-ed66a7b1741fb5153c4aa0729ac2d2a3dba188726a655bf76ab558887b81d32a43746ac33089f8eb420bf5bb81809cf2ad191cfb0c5a36a8984906eb0e24ceaa"' :
                                        'id="xs-injectables-links-module-MetricModule-ed66a7b1741fb5153c4aa0729ac2d2a3dba188726a655bf76ab558887b81d32a43746ac33089f8eb420bf5bb81809cf2ad191cfb0c5a36a8984906eb0e24ceaa"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MetricService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NoteModule.html" data-type="entity-link" >NoteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-NoteModule-0d2b82b39b83d31a80bfe148a63759b8363d6494db86f6dbed9d0125d7480775038d9097ce300dfb380a805163461751b8c8a77cbd12953da776381b3c94efd0"' : 'data-bs-target="#xs-controllers-links-module-NoteModule-0d2b82b39b83d31a80bfe148a63759b8363d6494db86f6dbed9d0125d7480775038d9097ce300dfb380a805163461751b8c8a77cbd12953da776381b3c94efd0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NoteModule-0d2b82b39b83d31a80bfe148a63759b8363d6494db86f6dbed9d0125d7480775038d9097ce300dfb380a805163461751b8c8a77cbd12953da776381b3c94efd0"' :
                                            'id="xs-controllers-links-module-NoteModule-0d2b82b39b83d31a80bfe148a63759b8363d6494db86f6dbed9d0125d7480775038d9097ce300dfb380a805163461751b8c8a77cbd12953da776381b3c94efd0"' }>
                                            <li class="link">
                                                <a href="controllers/NoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-NoteModule-0d2b82b39b83d31a80bfe148a63759b8363d6494db86f6dbed9d0125d7480775038d9097ce300dfb380a805163461751b8c8a77cbd12953da776381b3c94efd0"' : 'data-bs-target="#xs-injectables-links-module-NoteModule-0d2b82b39b83d31a80bfe148a63759b8363d6494db86f6dbed9d0125d7480775038d9097ce300dfb380a805163461751b8c8a77cbd12953da776381b3c94efd0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NoteModule-0d2b82b39b83d31a80bfe148a63759b8363d6494db86f6dbed9d0125d7480775038d9097ce300dfb380a805163461751b8c8a77cbd12953da776381b3c94efd0"' :
                                        'id="xs-injectables-links-module-NoteModule-0d2b82b39b83d31a80bfe148a63759b8363d6494db86f6dbed9d0125d7480775038d9097ce300dfb380a805163461751b8c8a77cbd12953da776381b3c94efd0"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NoteService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NoteService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModule.html" data-type="entity-link" >PaymentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PaymentModule-77e6386955f5109d0413e72a97c90df6896f96d4b3ca1333c02088456155d4fb6791ba572f12560ff83735ea5e4c27b486d5c71261fc0bcfcc4d28966bf77e13"' : 'data-bs-target="#xs-controllers-links-module-PaymentModule-77e6386955f5109d0413e72a97c90df6896f96d4b3ca1333c02088456155d4fb6791ba572f12560ff83735ea5e4c27b486d5c71261fc0bcfcc4d28966bf77e13"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PaymentModule-77e6386955f5109d0413e72a97c90df6896f96d4b3ca1333c02088456155d4fb6791ba572f12560ff83735ea5e4c27b486d5c71261fc0bcfcc4d28966bf77e13"' :
                                            'id="xs-controllers-links-module-PaymentModule-77e6386955f5109d0413e72a97c90df6896f96d4b3ca1333c02088456155d4fb6791ba572f12560ff83735ea5e4c27b486d5c71261fc0bcfcc4d28966bf77e13"' }>
                                            <li class="link">
                                                <a href="controllers/PaymentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaymentModule-77e6386955f5109d0413e72a97c90df6896f96d4b3ca1333c02088456155d4fb6791ba572f12560ff83735ea5e4c27b486d5c71261fc0bcfcc4d28966bf77e13"' : 'data-bs-target="#xs-injectables-links-module-PaymentModule-77e6386955f5109d0413e72a97c90df6896f96d4b3ca1333c02088456155d4fb6791ba572f12560ff83735ea5e4c27b486d5c71261fc0bcfcc4d28966bf77e13"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaymentModule-77e6386955f5109d0413e72a97c90df6896f96d4b3ca1333c02088456155d4fb6791ba572f12560ff83735ea5e4c27b486d5c71261fc0bcfcc4d28966bf77e13"' :
                                        'id="xs-injectables-links-module-PaymentModule-77e6386955f5109d0413e72a97c90df6896f96d4b3ca1333c02088456155d4fb6791ba572f12560ff83735ea5e4c27b486d5c71261fc0bcfcc4d28966bf77e13"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PaymentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PayosModule.html" data-type="entity-link" >PayosModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PayosModule-a9cde13e3ac84413023d796dea3cc53d93035bc44ff89af8da429cd45fb112076ac4ec7fb1ff03fe14323c170cd14d58b867cb132cd7ca3824385b67a244896b"' : 'data-bs-target="#xs-controllers-links-module-PayosModule-a9cde13e3ac84413023d796dea3cc53d93035bc44ff89af8da429cd45fb112076ac4ec7fb1ff03fe14323c170cd14d58b867cb132cd7ca3824385b67a244896b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PayosModule-a9cde13e3ac84413023d796dea3cc53d93035bc44ff89af8da429cd45fb112076ac4ec7fb1ff03fe14323c170cd14d58b867cb132cd7ca3824385b67a244896b"' :
                                            'id="xs-controllers-links-module-PayosModule-a9cde13e3ac84413023d796dea3cc53d93035bc44ff89af8da429cd45fb112076ac4ec7fb1ff03fe14323c170cd14d58b867cb132cd7ca3824385b67a244896b"' }>
                                            <li class="link">
                                                <a href="controllers/PayosController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayosController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PayosModule-a9cde13e3ac84413023d796dea3cc53d93035bc44ff89af8da429cd45fb112076ac4ec7fb1ff03fe14323c170cd14d58b867cb132cd7ca3824385b67a244896b"' : 'data-bs-target="#xs-injectables-links-module-PayosModule-a9cde13e3ac84413023d796dea3cc53d93035bc44ff89af8da429cd45fb112076ac4ec7fb1ff03fe14323c170cd14d58b867cb132cd7ca3824385b67a244896b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PayosModule-a9cde13e3ac84413023d796dea3cc53d93035bc44ff89af8da429cd45fb112076ac4ec7fb1ff03fe14323c170cd14d58b867cb132cd7ca3824385b67a244896b"' :
                                        'id="xs-injectables-links-module-PayosModule-a9cde13e3ac84413023d796dea3cc53d93035bc44ff89af8da429cd45fb112076ac4ec7fb1ff03fe14323c170cd14d58b867cb132cd7ca3824385b67a244896b"' }>
                                        <li class="link">
                                            <a href="injectables/PayosService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayosService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PostsModule.html" data-type="entity-link" >PostsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PostsModule-005039a394f920e4399f03527e554dbec5b97d825490b02e9030a2d958d6ddfed59fab2afdc480829d3a0dcc28292f0fc2b4b0123abe0ab1071007aaf5ce9b7d"' : 'data-bs-target="#xs-controllers-links-module-PostsModule-005039a394f920e4399f03527e554dbec5b97d825490b02e9030a2d958d6ddfed59fab2afdc480829d3a0dcc28292f0fc2b4b0123abe0ab1071007aaf5ce9b7d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PostsModule-005039a394f920e4399f03527e554dbec5b97d825490b02e9030a2d958d6ddfed59fab2afdc480829d3a0dcc28292f0fc2b4b0123abe0ab1071007aaf5ce9b7d"' :
                                            'id="xs-controllers-links-module-PostsModule-005039a394f920e4399f03527e554dbec5b97d825490b02e9030a2d958d6ddfed59fab2afdc480829d3a0dcc28292f0fc2b4b0123abe0ab1071007aaf5ce9b7d"' }>
                                            <li class="link">
                                                <a href="controllers/PostsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PostsModule-005039a394f920e4399f03527e554dbec5b97d825490b02e9030a2d958d6ddfed59fab2afdc480829d3a0dcc28292f0fc2b4b0123abe0ab1071007aaf5ce9b7d"' : 'data-bs-target="#xs-injectables-links-module-PostsModule-005039a394f920e4399f03527e554dbec5b97d825490b02e9030a2d958d6ddfed59fab2afdc480829d3a0dcc28292f0fc2b4b0123abe0ab1071007aaf5ce9b7d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PostsModule-005039a394f920e4399f03527e554dbec5b97d825490b02e9030a2d958d6ddfed59fab2afdc480829d3a0dcc28292f0fc2b4b0123abe0ab1071007aaf5ce9b7d"' :
                                        'id="xs-injectables-links-module-PostsModule-005039a394f920e4399f03527e554dbec5b97d825490b02e9030a2d958d6ddfed59fab2afdc480829d3a0dcc28292f0fc2b4b0123abe0ab1071007aaf5ce9b7d"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PostsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReactionModule.html" data-type="entity-link" >ReactionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReactionModule-2b3fa74c2666cfcfa97ca1a79bf908f8d79006215ed2e3f173beb24188224471c886eba80b365fca215a3aad0e87f3d57337f98e2949752842a1d7e5e8bdb918"' : 'data-bs-target="#xs-controllers-links-module-ReactionModule-2b3fa74c2666cfcfa97ca1a79bf908f8d79006215ed2e3f173beb24188224471c886eba80b365fca215a3aad0e87f3d57337f98e2949752842a1d7e5e8bdb918"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReactionModule-2b3fa74c2666cfcfa97ca1a79bf908f8d79006215ed2e3f173beb24188224471c886eba80b365fca215a3aad0e87f3d57337f98e2949752842a1d7e5e8bdb918"' :
                                            'id="xs-controllers-links-module-ReactionModule-2b3fa74c2666cfcfa97ca1a79bf908f8d79006215ed2e3f173beb24188224471c886eba80b365fca215a3aad0e87f3d57337f98e2949752842a1d7e5e8bdb918"' }>
                                            <li class="link">
                                                <a href="controllers/ReactionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReactionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReactionModule-2b3fa74c2666cfcfa97ca1a79bf908f8d79006215ed2e3f173beb24188224471c886eba80b365fca215a3aad0e87f3d57337f98e2949752842a1d7e5e8bdb918"' : 'data-bs-target="#xs-injectables-links-module-ReactionModule-2b3fa74c2666cfcfa97ca1a79bf908f8d79006215ed2e3f173beb24188224471c886eba80b365fca215a3aad0e87f3d57337f98e2949752842a1d7e5e8bdb918"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReactionModule-2b3fa74c2666cfcfa97ca1a79bf908f8d79006215ed2e3f173beb24188224471c886eba80b365fca215a3aad0e87f3d57337f98e2949752842a1d7e5e8bdb918"' :
                                        'id="xs-injectables-links-module-ReactionModule-2b3fa74c2666cfcfa97ca1a79bf908f8d79006215ed2e3f173beb24188224471c886eba80b365fca215a3aad0e87f3d57337f98e2949752842a1d7e5e8bdb918"' }>
                                        <li class="link">
                                            <a href="injectables/ReactionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReactionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RecordsModule.html" data-type="entity-link" >RecordsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RecordsModule-fc360107b41373e47298d479a172b7d0b196230f7344fe417b195503cc820a34ea17d6b6b8c32830c7e916bc9ffcf077b509bc51a3b6c774a2c868036436fa70"' : 'data-bs-target="#xs-controllers-links-module-RecordsModule-fc360107b41373e47298d479a172b7d0b196230f7344fe417b195503cc820a34ea17d6b6b8c32830c7e916bc9ffcf077b509bc51a3b6c774a2c868036436fa70"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RecordsModule-fc360107b41373e47298d479a172b7d0b196230f7344fe417b195503cc820a34ea17d6b6b8c32830c7e916bc9ffcf077b509bc51a3b6c774a2c868036436fa70"' :
                                            'id="xs-controllers-links-module-RecordsModule-fc360107b41373e47298d479a172b7d0b196230f7344fe417b195503cc820a34ea17d6b6b8c32830c7e916bc9ffcf077b509bc51a3b6c774a2c868036436fa70"' }>
                                            <li class="link">
                                                <a href="controllers/RecordsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecordsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RecordsModule-fc360107b41373e47298d479a172b7d0b196230f7344fe417b195503cc820a34ea17d6b6b8c32830c7e916bc9ffcf077b509bc51a3b6c774a2c868036436fa70"' : 'data-bs-target="#xs-injectables-links-module-RecordsModule-fc360107b41373e47298d479a172b7d0b196230f7344fe417b195503cc820a34ea17d6b6b8c32830c7e916bc9ffcf077b509bc51a3b6c774a2c868036436fa70"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RecordsModule-fc360107b41373e47298d479a172b7d0b196230f7344fe417b195503cc820a34ea17d6b6b8c32830c7e916bc9ffcf077b509bc51a3b6c774a2c868036436fa70"' :
                                        'id="xs-injectables-links-module-RecordsModule-fc360107b41373e47298d479a172b7d0b196230f7344fe417b195503cc820a34ea17d6b6b8c32830c7e916bc9ffcf077b509bc51a3b6c774a2c868036436fa70"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RecordsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecordsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StandardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StandardService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TimeUtilsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimeUtilsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReminderModule.html" data-type="entity-link" >ReminderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReminderModule-280c0bef341b750dff21e968001779e3c7d1e6ba8ba180dba8c9c55bd67783924a5edd12400d7f5fef46437f08f4e332526a4b1904e911cf3de2e24ad224445a"' : 'data-bs-target="#xs-controllers-links-module-ReminderModule-280c0bef341b750dff21e968001779e3c7d1e6ba8ba180dba8c9c55bd67783924a5edd12400d7f5fef46437f08f4e332526a4b1904e911cf3de2e24ad224445a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReminderModule-280c0bef341b750dff21e968001779e3c7d1e6ba8ba180dba8c9c55bd67783924a5edd12400d7f5fef46437f08f4e332526a4b1904e911cf3de2e24ad224445a"' :
                                            'id="xs-controllers-links-module-ReminderModule-280c0bef341b750dff21e968001779e3c7d1e6ba8ba180dba8c9c55bd67783924a5edd12400d7f5fef46437f08f4e332526a4b1904e911cf3de2e24ad224445a"' }>
                                            <li class="link">
                                                <a href="controllers/ReminderController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReminderController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReminderModule-280c0bef341b750dff21e968001779e3c7d1e6ba8ba180dba8c9c55bd67783924a5edd12400d7f5fef46437f08f4e332526a4b1904e911cf3de2e24ad224445a"' : 'data-bs-target="#xs-injectables-links-module-ReminderModule-280c0bef341b750dff21e968001779e3c7d1e6ba8ba180dba8c9c55bd67783924a5edd12400d7f5fef46437f08f4e332526a4b1904e911cf3de2e24ad224445a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReminderModule-280c0bef341b750dff21e968001779e3c7d1e6ba8ba180dba8c9c55bd67783924a5edd12400d7f5fef46437f08f4e332526a4b1904e911cf3de2e24ad224445a"' :
                                        'id="xs-injectables-links-module-ReminderModule-280c0bef341b750dff21e968001779e3c7d1e6ba8ba180dba8c9c55bd67783924a5edd12400d7f5fef46437f08f4e332526a4b1904e911cf3de2e24ad224445a"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReminderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReminderService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StandardModule.html" data-type="entity-link" >StandardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StandardModule-34f415caa8c8364da00863b78a36cb08370066e1ab775506329c5a8c93cc2e330549fc3b5a2cfd33019f3cfb670d9effa8a6f10084f6b6f06cff62c0af53b91c"' : 'data-bs-target="#xs-controllers-links-module-StandardModule-34f415caa8c8364da00863b78a36cb08370066e1ab775506329c5a8c93cc2e330549fc3b5a2cfd33019f3cfb670d9effa8a6f10084f6b6f06cff62c0af53b91c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StandardModule-34f415caa8c8364da00863b78a36cb08370066e1ab775506329c5a8c93cc2e330549fc3b5a2cfd33019f3cfb670d9effa8a6f10084f6b6f06cff62c0af53b91c"' :
                                            'id="xs-controllers-links-module-StandardModule-34f415caa8c8364da00863b78a36cb08370066e1ab775506329c5a8c93cc2e330549fc3b5a2cfd33019f3cfb670d9effa8a6f10084f6b6f06cff62c0af53b91c"' }>
                                            <li class="link">
                                                <a href="controllers/StandardController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StandardController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StandardModule-34f415caa8c8364da00863b78a36cb08370066e1ab775506329c5a8c93cc2e330549fc3b5a2cfd33019f3cfb670d9effa8a6f10084f6b6f06cff62c0af53b91c"' : 'data-bs-target="#xs-injectables-links-module-StandardModule-34f415caa8c8364da00863b78a36cb08370066e1ab775506329c5a8c93cc2e330549fc3b5a2cfd33019f3cfb670d9effa8a6f10084f6b6f06cff62c0af53b91c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StandardModule-34f415caa8c8364da00863b78a36cb08370066e1ab775506329c5a8c93cc2e330549fc3b5a2cfd33019f3cfb670d9effa8a6f10084f6b6f06cff62c0af53b91c"' :
                                        'id="xs-injectables-links-module-StandardModule-34f415caa8c8364da00863b78a36cb08370066e1ab775506329c5a8c93cc2e330549fc3b5a2cfd33019f3cfb670d9effa8a6f10084f6b6f06cff62c0af53b91c"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StandardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StandardService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TagModule.html" data-type="entity-link" >TagModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TagModule-f58830410e022b607aa18d053b6b070f5110451838f6566e0b6cca2508bd3b2dbb43750fbf1b07f57dd264ee3b102854d43645d2a8da1449b184a9b9f1d165f7"' : 'data-bs-target="#xs-controllers-links-module-TagModule-f58830410e022b607aa18d053b6b070f5110451838f6566e0b6cca2508bd3b2dbb43750fbf1b07f57dd264ee3b102854d43645d2a8da1449b184a9b9f1d165f7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TagModule-f58830410e022b607aa18d053b6b070f5110451838f6566e0b6cca2508bd3b2dbb43750fbf1b07f57dd264ee3b102854d43645d2a8da1449b184a9b9f1d165f7"' :
                                            'id="xs-controllers-links-module-TagModule-f58830410e022b607aa18d053b6b070f5110451838f6566e0b6cca2508bd3b2dbb43750fbf1b07f57dd264ee3b102854d43645d2a8da1449b184a9b9f1d165f7"' }>
                                            <li class="link">
                                                <a href="controllers/TagController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TagModule-f58830410e022b607aa18d053b6b070f5110451838f6566e0b6cca2508bd3b2dbb43750fbf1b07f57dd264ee3b102854d43645d2a8da1449b184a9b9f1d165f7"' : 'data-bs-target="#xs-injectables-links-module-TagModule-f58830410e022b607aa18d053b6b070f5110451838f6566e0b6cca2508bd3b2dbb43750fbf1b07f57dd264ee3b102854d43645d2a8da1449b184a9b9f1d165f7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TagModule-f58830410e022b607aa18d053b6b070f5110451838f6566e0b6cca2508bd3b2dbb43750fbf1b07f57dd264ee3b102854d43645d2a8da1449b184a9b9f1d165f7"' :
                                        'id="xs-injectables-links-module-TagModule-f58830410e022b607aa18d053b6b070f5110451838f6566e0b6cca2508bd3b2dbb43750fbf1b07f57dd264ee3b102854d43645d2a8da1449b184a9b9f1d165f7"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TagService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-8fde6e5df97ecbbdf966d2f1934705c55b7465f5f1e8ff7b478d2ced91e8bd953260e29a32d6ec4889f8a440fe7001fef323be835ad454bce3941cee45603107"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-8fde6e5df97ecbbdf966d2f1934705c55b7465f5f1e8ff7b478d2ced91e8bd953260e29a32d6ec4889f8a440fe7001fef323be835ad454bce3941cee45603107"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-8fde6e5df97ecbbdf966d2f1934705c55b7465f5f1e8ff7b478d2ced91e8bd953260e29a32d6ec4889f8a440fe7001fef323be835ad454bce3941cee45603107"' :
                                            'id="xs-controllers-links-module-UsersModule-8fde6e5df97ecbbdf966d2f1934705c55b7465f5f1e8ff7b478d2ced91e8bd953260e29a32d6ec4889f8a440fe7001fef323be835ad454bce3941cee45603107"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-8fde6e5df97ecbbdf966d2f1934705c55b7465f5f1e8ff7b478d2ced91e8bd953260e29a32d6ec4889f8a440fe7001fef323be835ad454bce3941cee45603107"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-8fde6e5df97ecbbdf966d2f1934705c55b7465f5f1e8ff7b478d2ced91e8bd953260e29a32d6ec4889f8a440fe7001fef323be835ad454bce3941cee45603107"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-8fde6e5df97ecbbdf966d2f1934705c55b7465f5f1e8ff7b478d2ced91e8bd953260e29a32d6ec4889f8a440fe7001fef323be835ad454bce3941cee45603107"' :
                                        'id="xs-injectables-links-module-UsersModule-8fde6e5df97ecbbdf966d2f1934705c55b7465f5f1e8ff7b478d2ced91e8bd953260e29a32d6ec4889f8a440fe7001fef323be835ad454bce3941cee45603107"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AdminController.html" data-type="entity-link" >AdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BlogsController.html" data-type="entity-link" >BlogsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CategorysController.html" data-type="entity-link" >CategorysController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CommentsController.html" data-type="entity-link" >CommentsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HospitalController.html" data-type="entity-link" >HospitalController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MailController.html" data-type="entity-link" >MailController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MediaController.html" data-type="entity-link" >MediaController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MembershipsController.html" data-type="entity-link" >MembershipsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MetricController.html" data-type="entity-link" >MetricController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NoteController.html" data-type="entity-link" >NoteController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PaymentController.html" data-type="entity-link" >PaymentController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PayosController.html" data-type="entity-link" >PayosController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PostsController.html" data-type="entity-link" >PostsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReactionController.html" data-type="entity-link" >ReactionController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RecordsController.html" data-type="entity-link" >RecordsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReminderController.html" data-type="entity-link" >ReminderController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/StandardController.html" data-type="entity-link" >StandardController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TagController.html" data-type="entity-link" >TagController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
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
                                <a href="classes/Blog.html" data-type="entity-link" >Blog</a>
                            </li>
                            <li class="link">
                                <a href="classes/Category.html" data-type="entity-link" >Category</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReactionDto.html" data-type="entity-link" >CreateReactionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateStandardDto.html" data-type="entity-link" >CreateStandardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Hospital.html" data-type="entity-link" >Hospital</a>
                            </li>
                            <li class="link">
                                <a href="classes/HospitalEntity.html" data-type="entity-link" >HospitalEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/MatchConstraint.html" data-type="entity-link" >MatchConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/Media.html" data-type="entity-link" >Media</a>
                            </li>
                            <li class="link">
                                <a href="classes/Media-1.html" data-type="entity-link" >Media</a>
                            </li>
                            <li class="link">
                                <a href="classes/Metric.html" data-type="entity-link" >Metric</a>
                            </li>
                            <li class="link">
                                <a href="classes/Reaction.html" data-type="entity-link" >Reaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReminderEntity.html" data-type="entity-link" >ReminderEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocketIoAdapter.html" data-type="entity-link" >SocketIoAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Standard.html" data-type="entity-link" >Standard</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tag.html" data-type="entity-link" >Tag</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenDto.html" data-type="entity-link" >TokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateReactionDto.html" data-type="entity-link" >UpdateReactionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStandardDto.html" data-type="entity-link" >UpdateStandardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntity.html" data-type="entity-link" >UserEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/VisitRecord.html" data-type="entity-link" >VisitRecord</a>
                            </li>
                            <li class="link">
                                <a href="classes/VisitRecordIncludeOtherTables.html" data-type="entity-link" >VisitRecordIncludeOtherTables</a>
                            </li>
                            <li class="link">
                                <a href="classes/VisitRecordMetric.html" data-type="entity-link" >VisitRecordMetric</a>
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
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BlogsService.html" data-type="entity-link" >BlogsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategorysService.html" data-type="entity-link" >CategorysService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommentsService.html" data-type="entity-link" >CommentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatabaseService.html" data-type="entity-link" >DatabaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link" >FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HospitalService.html" data-type="entity-link" >HospitalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtUtilsService.html" data-type="entity-link" >JwtUtilsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailService.html" data-type="entity-link" >MailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaService.html" data-type="entity-link" >MediaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MembershipsService.html" data-type="entity-link" >MembershipsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MetricService.html" data-type="entity-link" >MetricService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NoteService.html" data-type="entity-link" >NoteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaymentService.html" data-type="entity-link" >PaymentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PayosService.html" data-type="entity-link" >PayosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostsService.html" data-type="entity-link" >PostsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReactionService.html" data-type="entity-link" >ReactionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecordsService.html" data-type="entity-link" >RecordsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReminderService.html" data-type="entity-link" >ReminderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StandardService.html" data-type="entity-link" >StandardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TagService.html" data-type="entity-link" >TagService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TimeUtilsService.html" data-type="entity-link" >TimeUtilsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AccessTokenAuthGuard.html" data-type="entity-link" >AccessTokenAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/IsLoggin.html" data-type="entity-link" >IsLoggin</a>
                            </li>
                            <li class="link">
                                <a href="guards/RefreshTokenAuthGuard.html" data-type="entity-link" >RefreshTokenAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleAuthGuard.html" data-type="entity-link" >RoleAuthGuard</a>
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
                                <a href="interfaces/Hospital.html" data-type="entity-link" >Hospital</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetricDTO.html" data-type="entity-link" >MetricDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Reminder.html" data-type="entity-link" >Reminder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenDataType.html" data-type="entity-link" >TokenDataType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
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