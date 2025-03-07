import { NgClass, NgComponentOutlet } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

export interface PageLayoutsOverviewData {
    title: string;
    description: string;
    availableOptions: {
        value: string;
        title: string;
    }[];
    selectedOption: string;
    options: {
        [option: string]: {
            description: string;
            link: string;
            component: any;
        };
    };
}

@Component({
    selector: 'layout-overview',
    template: `
        <div class="mx-auto w-full max-w-320 px-6 md:px-8">
            <div class="py-8">
                <!-- Info -->
                <div>
                    <div
                        class="text-3xl font-extrabold tracking-tight md:text-4xl"
                    >
                        {{ overview.title }}
                    </div>
                    <div class="text-secondary text-lg md:text-xl">
                        {{ overview.description }}
                    </div>
                    <div class="mt-6 md:mt-8">
                        <mat-button-toggle-group
                            class="-m-2 flex flex-wrap items-center"
                            name="options"
                            [(ngModel)]="overview.selectedOption"
                        >
                            @for (
                                option of overview.availableOptions;
                                track option
                            ) {
                                <mat-button-toggle
                                    class="m-2 font-medium"
                                    [ngClass]="{
                                        'bg-gray-300 dark:bg-gray-700':
                                            option.value ===
                                            overview.selectedOption,
                                        'bg-transparent':
                                            option.value !==
                                            overview.selectedOption,
                                    }"
                                    [value]="option.value"
                                >
                                    {{ option.title }}
                                </mat-button-toggle>
                            }
                        </mat-button-toggle-group>
                    </div>
                </div>
                <!-- Options -->
                @if (
                    overview.options[overview.selectedOption];
                    as selectedOption
                ) {
                    <div>
                        <!-- Preview -->
                        <div
                            class="relative z-20 mt-10 h-192 overflow-auto rounded-2xl shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
                        >
                            <div class="flex min-h-full flex-auto">
                                <!-- Navigation -->
                                <div
                                    class="sticky top-0 hidden h-192 w-56 flex-0 border-r border-gray-300 bg-gray-200 dark:border-gray-700 dark:bg-gray-800 md:block"
                                >
                                    <div class="h-4"></div>
                                    <div
                                        class="m-6 h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700"
                                    ></div>
                                    <div
                                        class="m-6 h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700"
                                    ></div>
                                    <div
                                        class="m-6 h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700"
                                    ></div>
                                    <div
                                        class="m-6 h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700"
                                    ></div>
                                    <div
                                        class="m-6 h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700"
                                    ></div>
                                </div>
                                <!-- Content -->
                                <div class="flex flex-auto flex-col">
                                    <!-- Header -->
                                    <div
                                        class="relative z-10 flex h-16 items-center justify-end border-b border-gray-300 bg-gray-200 px-6 dark:border-gray-700 dark:bg-gray-800 sm:px-10"
                                    >
                                        <div
                                            class="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700"
                                        ></div>
                                    </div>
                                    <!-- Main -->
                                    <div
                                        id="component-container"
                                        class="relative flex flex-auto flex-col"
                                    >
                                        <ng-container
                                            *ngComponentOutlet="
                                                selectedOption.component
                                            "
                                        ></ng-container>
                                    </div>
                                    <!-- Footer -->
                                    <div
                                        class="relative z-10 flex h-14 items-center border-t border-gray-300 bg-gray-200 px-6 dark:border-gray-700 dark:bg-gray-800 sm:px-10"
                                    >
                                        <div
                                            class="h-4 w-32 rounded-full bg-gray-300 dark:bg-gray-700"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Preview details -->
                        <div class="mt-8 flex items-center justify-between">
                            <div>
                                <div>{{ selectedOption.description }}</div>
                                <div class="mt-1">
                                    <code class="text-md"
                                        >/src/app/modules/admin{{
                                            selectedOption.link
                                        }}/</code
                                    >
                                </div>
                            </div>
                            @if (selectedOption.link) {
                                <div>
                                    <a
                                        mat-flat-button
                                        [color]="'primary'"
                                        [routerLink]="selectedOption.link"
                                    >
                                        <mat-icon
                                            class="icon-size-4"
                                            [svgIcon]="
                                                'heroicons_mini:arrow-top-right-on-square'
                                            "
                                        ></mat-icon>
                                        <span class="ml-2">View</span>
                                    </a>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [
        `
            layout-overview #component-container > *:first-child {
                position: relative;
                display: flex;
                flex-direction: column;
                flex: 1 1 auto;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatButtonToggleModule,
        FormsModule,
        NgClass,
        NgComponentOutlet,
        MatButtonModule,
        RouterLink,
        MatIconModule,
    ],
})
export class LayoutOverviewComponent implements OnInit {
    overview: PageLayoutsOverviewData;

    /**
     * Constructor
     */
    constructor(private _activatedRoute: ActivatedRoute) {}

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the route data
        this.overview = this._activatedRoute.snapshot.data.overview;
    }
}
