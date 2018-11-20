module.exports = {
  data: () => ({
    total: 10
  }),
  template: `
  <div class="paginate block clear">
        <a href="#">上一页</a>
        <a href="#" class="active">1</a>
        <a href="#">2</a>
        <a href="#">3</a>
        <span>...</span>
        <a href="#">5</a>
        <a href="#">下一页</a>

        <span class="text-small padder-sm">共 {{total}} 页</span>
        <span>去第</span>
        <input type="text" name="" value="" class="page-input">
        <span>页</span>
    </ul>
  </div>
  `
}
