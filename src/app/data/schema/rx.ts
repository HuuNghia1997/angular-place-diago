import { Observable } from 'rxjs';

export const importDiagram = (bpmnJS) => <Object>(source: Observable<string>) =>
  new Observable<string>(observer => {
    const subscription = source.subscribe({next(xml: string) {
      subscription.unsubscribe();
      bpmnJS.importXML(xml, function(err, warnings) {
        if (err) {
          observer.error(err);
        } else {
          observer.next(warnings);
        }
        observer.complete();
      });
    }, error(e) {
      observer.error(e);
    }, complete() {
      observer.complete();
    }
  });
});
