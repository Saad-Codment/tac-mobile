import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

// ── Styles ───────────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
  // ── Screen ──
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    paddingTop: hp('2'),
    paddingBottom: hp('15'),
    flexGrow: 1,
  },

  // ── Card Wrapper ──
  card: {
    backgroundColor: Colors.lightInnerColor,
    marginHorizontal: wp('5'),
    marginBottom: hp('2'),
    borderRadius: 14,
    borderWidth: 0.4,
    borderColor: Colors.dkBorderColor,
    overflow: 'hidden',
  },

  // ── Card Image ──
  cardImage: {
    width: '100%',
    height: hp('18'),
  },

  // ── Image Placeholder ──
  imagePlaceholder: {
    width: '100%',
    height: hp('18'),
    backgroundColor: Colors.grayBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderIcon: {
    width: wp('10'),
    height: hp('5'),
    opacity: 0.3,
  },
  imagePlaceholderText: {
    fontSize: hp('1.3'),
    marginTop: hp('0.5'),
  },

  // ── Card Body ──
  cardBody: {
    padding: wp('4'),
  },

  // ── Title Row ──
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5'),
  },
  titleTextWrapper: {
    flex: 1,
  },
  truckTitle: {
    fontSize: hp('1.8'),
    fontWeight: '700',
    color: Colors.black,
  },
  truckName: {
    fontSize: hp('1.3'),
    marginTop: hp('0.2'),
  },
  arrowIcon: {
    width: wp('4'),
    height: hp('2'),
    tintColor: Colors.black,
  },

  // ── Divider ──
  divider: {
    height: 0.5,
    backgroundColor: Colors.dkBorderColor,
    marginVertical: hp('1'),
  },

  // ── Specs Grid ──
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: Colors.dkBorderColor,
    paddingVertical: hp('0.8'),
    paddingHorizontal: wp('3'),
    marginBottom: hp('1'),
  },
  specLabel: {
    fontSize: hp('1.1'),
  },
  specValue: {
    fontSize: hp('1.4'),
    fontWeight: '600',
    color: Colors.black,
    marginTop: hp('0.2'),
  },

  // ── Actions Row ──
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: wp('3'),
  },
  editBtn: {
    backgroundColor: 'white',
    paddingVertical: hp('0.7'),
    paddingHorizontal: wp('4'),
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
  },
  editBtnText: {
    fontSize: hp('1.3'),
    color: Colors.primaryColor,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#FF4D4D18',
    paddingVertical: hp('0.7'),
    paddingHorizontal: wp('4'),
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#FF4D4D',
  },
  deleteBtnText: {
    fontSize: hp('1.3'),
    color: '#FF4D4D',
    fontWeight: '600',
  },

  // ── Empty State ──
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('20'),
  },
  emptyIcon: {
    width: wp('15'),
    height: hp('8'),
    opacity: 0.2,
  },
  emptyTitle: {
    fontSize: hp('1.6'),
    marginTop: hp('1.5'),
  },
  emptySubtitle: {
    fontSize: hp('1.3'),
    marginTop: hp('0.5'),
  },

  // ── Add Button ──
  addBtnWrapper: {
    position: 'absolute',
    bottom: hp('4'),
    left: wp('5'),
    right: wp('5'),
  },
  addBtn: {
    borderRadius: 10,
    height: hp('4.5'),
  },
  addBtnText: {
    fontSize: hp('1.5'),
  },

  // ── Pagination Footer Loader ──
  footerLoader: {
    marginTop: hp('2'),
    marginBottom: hp('5'),
  },

  // ── Load More Button ──
  loadMoreBtn: {
    marginTop: hp('2'),
    width: wp('30'),
    height: hp('4'),
    alignSelf: 'center',
    marginBottom: hp('5'),
  },
  loadMoreBtnText: {
    fontSize: hp('1.5'),
  },
});
