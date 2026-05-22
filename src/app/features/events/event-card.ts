import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, RouterLink],
  template: `
    <div
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <!-- TODO: Add Image -->
      <div class="relative h-48 w-full bg-gray-200">
        <img
          [src]="image()"
          class="object-cover w-full h-full max-h-full max-w-full"
          alt="Event thumbnail"
        />
      </div>
      <div class="p-6">
        <div class="flex justify-between items-center mt-4">
          <!-- TODO Mod 1: Add Date using DatePipe -->
          <p class="text-sm text-blue-600 font-semibold mb-2">
            {{ (date() | date: 'mediumDate') || 'TBA' }}
          </p>

          @let days = daysUntil();
          @if (days !== null) {
            <div
              class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
            >
              @if (days > 0) {
                In {{ days }} Days
              } @else if (days < 0) {
                Past event
              } @else {
                Happening Now!
              }
            </div>
          }
        </div>

        <!-- TODO Mod 1: Add Title Input -->
        <h3 class="text-xl font-bold text-gray-800 my-2">{{ title() }}</h3>

        <div class="flex justify-between items-center mt-4">
          <button
            (click)="toggleFavorite()"
            [class.text-red-500]="isFavorite()"
            class="text-gray-400 hover:text-red-500 transition-colors flex gap-2 items-center"
          >
            <!-- Dynamic Heart Icon -->
            <span>{{ isFavorite() ? '♥' : '♡' }}</span>
            Like
          </button>

          <button (click)="removeEvent()" class="text-gray-400 text-sm hover:text-gray-600">
            Remove
          </button>
        </div>

        <!-- Inside template -->
        <div class="mt-4 pt-4 border-t border-gray-100 text-right">
          <!-- Use [routerLink] with the id signal -->
          <a
            [routerLink]="['/event', id()]"
            class="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  `,
})
export class EventCard {
  readonly id = input.required<string>();
  title = input.required<string>();
  image = input.required<string>();
  date = input<string>();

  initialLike = input(false);

  isFavorite = linkedSignal(() => this.initialLike());

  delete = output<void>();

  daysUntil = computed(() => {
    const evendDate = this.date();
    if (!evendDate) return null;

    const today = new Date();
    const target = new Date(evendDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  });

  toggleFavorite() {
    // 3. Update the signal based on previous value
    this.isFavorite.update((val) => !val);
  }

  removeEvent() {
    this.delete.emit();
  }
}
