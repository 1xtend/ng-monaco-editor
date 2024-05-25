import { Observable } from 'rxjs';

export const observeResize = <T extends Element>(
  target: T,
  options?: ResizeObserverOptions
) =>
  new Observable<T>((observer) => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => observer.next(entry.target as T));
    });

    resizeObserver.observe(target, options);

    return () => {
      resizeObserver.unobserve(target);
      resizeObserver.disconnect();
    };
  });
