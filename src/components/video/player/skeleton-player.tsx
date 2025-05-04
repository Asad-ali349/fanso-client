import classNames from 'classnames';
import style from './skeleton-player.module.scss';

export function SkeletonPlayer() {
  return (
    <div className={classNames(style['player-skeleton'], 'skeleton-loading')} />
  );
}
