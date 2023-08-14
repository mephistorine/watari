export type Mapper<I, O> = {
  mapTo(props: I): O
  mapFrom(entity: O): I
}
