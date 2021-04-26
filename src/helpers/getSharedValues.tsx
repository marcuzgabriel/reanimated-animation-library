interface Props {
  fromPath: string;
  toPath: string;
}

export const getSharedValues = ({
  fromPath,
  toPath,
}: Props): Array<{
  index: number;
  start: string;
  end: string;
}> => {
  const fromPathNumbers = fromPath.split(' ').map((path, i) => ({ index: i, path }));
  const toPathNumbers = toPath.split(' ').map((path, i) => ({ index: i, path }));

  return fromPathNumbers.map(({ index, path }, i) => ({
    index,
    start: path,
    end: toPathNumbers[i].path,
  }));
};
