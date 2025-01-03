import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CacheService {
  prunables: Prunable[] = [];

  registerPrunable(prunable: Prunable) {
    this.prunables.push(prunable);
  }

  pruneAll() {
    this.prunables.forEach((p) => p.pruneCache());
  }
}

export interface Prunable {
  pruneCache(): void;
}
