import request from "@/utils/request";
export function fetchDeptType(data) {
  return request({
    url: "/dept/type",
    method: "post",
    data
  });
}

export function deptDownload(data) {
  return request({
    url: "/dept/download",
    method: "post",
    data
  });
}

export function fetchDeptMz(data) {
  return request({
    url: "/dept/mz",
    method: "post",
    data
  });
}

export function fetchDeptZj(data) {
    return request({
      url: "/dept/zj",
      method: "post",
      data
    });
  }

  export function fetchDeptYb(data) {
    return request({
      url: "/dept/yb",
      method: "post",
      data
    });
  }

  export function fetchDeptYbList(data) {
    return request({
      url: "/dept/yb/list",
      method: "post",
      data
    });
  }

  export function deptYbSend(data) {
    return request({
      url: "/dept/yb/send",
      method: "post",
      data
    });
  }

  export function fetchDeptWj(data) {
    return request({
      url: "/dept/wj",
      method: "post",
      data
    });
  }

  export function fetchDeptCl(data) {
    return request({
      url: "/dept/cl",
      method: "post",
      data
    });
  }

  export function fetchDeptJy(data) {
    return request({
      url: "/dept/jy",
      method: "post",
      data
    });
  }
