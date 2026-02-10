<template>
  <div class="mt-[50px]">
    <div class="flex justify-between px-[50px]">
      <div class="flex justify-center flex-col gap-2">
        <div class="flex justify-center">
          <img class="w-[110px] h-[110px]" :src="qrCodeUrl" alt="" />
        </div>
        <div class="flex gap-2 items-center text-[#86909C]">
          <span>地址：123456789serewreWoc</span>
          <img class="w-[16px] h-[16px] cursor-pointer" :src="copyUrl" alt="" />
        </div>
      </div>
      <div class="flex flex-col items-center gap-2 justify-center">
        <CustomUpload
          class="w-[auto]"
          :accept="'.png,.jpg,.jpeg'"
          :maxSize="1024 * 1024 * 2"
          :maxNum="1"
          @update:value="handleUpdate"
        ></CustomUpload>
        <div class="text-[#86909C]">上传付款截图凭证</div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import qrCodeUrl from '@/assets/images/qr-code.png'
  import copyUrl from '@/assets/images/copy.svg'

  const emit = defineEmits(['change'])

  const handleUpdate = (value) => {
    emit('change', value)
  }
</script>
